"use server";
// contains the logic for rank

/*
 *  Ranks:
 *    - Iron: 0 - 1,000
 *    - Bronze: 1,000 - 10,000
 *    - Silver: 10,000 - 20,000
 *    - Gold: 20,000 - 50,000
 *    - Platinum: 50,000 - 100,000
 *    - Diamond: 100,000 - 200,000
 *    - Masters: 200,000 - 1,000,000
 *    - Mythical: 1,000,000 - ...
 *
 **/
import connectDB from "./connect-mongo";
import type { IRank } from "@/models/rank";
import Rank from "@/models/rank";
import { CheckRankCollection } from "./mongo-functions";
import Login, { type ILogin } from "@/models/logins";
import RankLog from "@/models/ranklog";
import { compareTwoDates } from "./useful-functions";
import { RemoveFormattingIcon } from "lucide-react";

/**
 * function that determines the number of points to give
 * @param time - The time in minutes
 */
function determineFocusPoints(time: number, marathon: boolean) {
  if (time < 0) {
    console.error("Time focused is negative");
  }

  // TODO: Account for streaks

  // smaller focuses give least amount of points
  if (time < 10) {
    if (marathon) {
      return 3 * time;
    }
    return 2 * time;
  }
  if (time < 30) {
    if (marathon) {
      return 3.5 * time;
    }
    return 2.5 * time;
  }
  if (time < 120) {
    if (marathon) {
      return 200 + 4 * time;
    }
    return 100 + 3 * time;
  }
  if (marathon) {
    return 300 + 5 * time;
  }
  return 5 * time;
}

function determineLoginPoints(conseuctive_days: number) {
  let points = 100;
  // is on a login streak
  if (conseuctive_days > 1) {
    // a week
    if (conseuctive_days > 7) {
      points = 125;
    }
    // more than a month
    else if (conseuctive_days > 30) {
      points = 150;
    }
    // more than 3 months
    else if (conseuctive_days > 90) {
      points = 175;
    }
    // more than 6 months
    else if (conseuctive_days > 180) {
      points = 200;
    }
    // more than a year
    else if (conseuctive_days > 365) {
      points = 250;
    }
  }
  return points;
}

// streaks don't lose that much since it is not reasonable to "focus" everyday
function determineLoseStreakPoints(streak: number) {
  let points = 50;
  switch (true) {
    case 1 < streak && streak <= 7:
      break;
    case 7 < streak && streak <= 30:
      points = 100;
      break;
    case 30 < streak && streak <= 185:
      points = 200;
      break;
  }
  return points;
}

async function checkRankUpdate() {
  try {
    await connectDB();

    const rank: IRank = (await Rank.find())[0];

    const points = rank.points;

    switch (true) {
      case points > 1000 && points <= 10000:
        await Rank.findByIdAndUpdate(
          rank._id,
          { rank: "Bronze" },
          { new: true },
        );
        break;
      case points <= 20000:
        await Rank.findByIdAndUpdate(
          rank._id,
          { rank: "Silver" },
          { new: true },
        );
        break;
      case points <= 50000:
        await Rank.findByIdAndUpdate(rank._id, { rank: "Gold" }, { new: true });
        break;
      case points <= 100000:
        await Rank.findByIdAndUpdate(
          rank._id,
          { rank: "Platinum" },
          { new: true },
        );
        break;
      case points <= 200000:
        await Rank.findByIdAndUpdate(
          rank._id,
          { rank: "Diamond" },
          { new: true },
        );
        break;
      case points <= 1000000:
        await Rank.findByIdAndUpdate(
          rank._id,
          { rank: "Masters" },
          { new: true },
        );
        break;
      case points > 1000000:
        await Rank.findByIdAndUpdate(
          rank._id,
          { rank: "Mythical" },
          { new: true },
        );
        break;
    }
  } catch (error) {
    console.error(error);
  }
}

async function updateRank(points: number, desc: string) {
  const rank: IRank = (await Rank.find())[0];
  await RankLog.create({
    points: points,
    time: new Date(),
    description: desc,
  });
  await Rank.findByIdAndUpdate(
    rank._id,
    { points: rank.points + points },
    { new: true },
  );
}

function determineLosePointsNotFocus(remaining: number, type: string) {
  // lose more points for not completing focuses in case user decides to not take break and finish focusing
  let points = 100;
  switch (type.toLowerCase()) {
    case "focus":
    case "marathon":
      switch (true) {
        case 0 === remaining:
          return 0;
        case 0 < remaining && remaining <= 15:
          points = 1.5 * points;
          break;
        case 15 < remaining && remaining <= 30:
          points = 2.0 * points;
          break;
        case 30 < remaining && remaining <= 45:
          points = 2.5 * points;
          break;
        case 45 > remaining:
          points = 3.0 * points;
          break;
      }
      break;
    case "break":
    case "marathonbreak":
      switch (true) {
        case 0 < remaining && remaining <= 15:
          points = 0.5 * points;
          break;
        case 15 < remaining && remaining <= 30:
          points = 1.0 * points;
          break;
        case 30 < remaining && remaining <= 45:
          points = 1.5 * points;
          break;
        case 45 > remaining:
          points = 2.0 * points;
          break;
      }
      break;
  }
  return points;
}

/**
 * @returns the Rank object
 */
export async function getRank() {
  try {
    await connectDB();
    // ensure that the rank collection is created
    CheckRankCollection();
    const rank: IRank = (await Rank.find())[0];
    return JSON.parse(JSON.stringify(rank));
  } catch (error) {
    console.error(error);
  }
}

//////////////////////////
// Logic                //
//////////////////////////

// when the user logins, they gain some points (more if consecutive)
export async function login(consecutive_days: number) {
  try {
    await connectDB();

    // ensure that the rank collection is created
    CheckRankCollection();
    const points = determineLoginPoints(consecutive_days);
    updateRank(points, "login");
    await checkRankUpdate();
  } catch (error) {
    console.error(error);
  }
}

/**
 * when the user is focusing, they gain points via the amount they have spent focusing
 * @param time - Time in minutes
 * @param marathon - optional to determine whether focus is via a marathon focus or not
 */
export async function focusing(time: number, marathon: boolean) {
  try {
    await connectDB();

    // ensure that the rank collection is created
    CheckRankCollection();
    const points = determineFocusPoints(time, marathon);
    updateRank(points, "focusing");
    await checkRankUpdate();
  } catch (error) {
    console.error(error);
  }
}

export async function finishedBreak(marathon: boolean) {
  // TODO: Award points for also completing breaks
  try {
    await connectDB();
    let points = 150;
    if (marathon) {
      points = 200;
    }
    updateRank(points, "completing break");

    await checkRankUpdate();
  } catch (error) {
    console.error(error);
  }
}

export async function brokeStreak(streak: number) {
  try {
    await connectDB();

    const points = determineLoseStreakPoints(streak);
    updateRank(-points, "broke login streak");
  } catch (error) {
    console.error(error);
  }
}

/**
 * @param remaining - The remaining time
 * @param type - The timer type that is currently unfinished
 */
export async function notFinish(remaining: number, type: string) {
  try {
    await connectDB();
    const points = determineLosePointsNotFocus(remaining, type);
    if (points !== 0) {
      updateRank(-points, `not finished with ${type.toLowerCase()}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function pausedFocus() {
  try {
    await connectDB();
    updateRank(-100, "paused focus");
  } catch (error) {
    console.error(error);
  }
}
