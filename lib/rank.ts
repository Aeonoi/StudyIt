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
import RankLog, { type IRankLog } from "@/models/ranklog";
import { compareTwoDates, rankPoints } from "./useful-functions";

/**
 * function that determines the number of points to give
 *
 * @param {number} time - The focus time in minutes
 * @param {boolean} marathon - Flag that determines whether the focus time was from the marathon timer
 * @returns {number} The total number of points to give based on the total focus time
 */
function determineFocusPoints(time: number, marathon: boolean): number {
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

/**
 * Determiones the total points to give given the conseuctive days the user has been logged in for
 *
 * @param {number} conseuctive_days - The consecutive login days
 * @returns {number} The number of points from the number of conseuctive days
 */
function determineLoginPoints(conseuctive_days: number): number {
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

/**
 * Determines the total points to lose given the login streak
 *
 * @param {number} streak - The login streak
 * @returns {number} The total number of points the user loses from the broken streak
 */
function determineLoseStreakPoints(streak: number): number {
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

/**
 * Updates the current rank and the tier fields. This is mostly to update after gaining or losing points. This is also for insurance to check that the rank is shown properly.
 *
 */
async function checkRankUpdate(): Promise<void> {
  try {
    await connectDB();

    const rank: IRank = (await Rank.find())[0];

    const points = rank.points;

    switch (true) {
      case points > 1000 && points <= 10000: {
        let tierName = "Bronze";
        for (let i = 0; i < 5; i++) {
          const rankValue = rankPoints.get(tierName + i);
          if (rankValue !== undefined && rankValue >= points) {
            tierName += i;
          }
        }
        await Rank.findByIdAndUpdate(
          rank._id,
          { rank: "Bronze", tier: tierName },
          { new: true },
        );
        break;
      }
      case points <= 20000: {
        let tierName = "Silver";
        for (let i = 0; i < 5; i++) {
          const rankValue = rankPoints.get(tierName + i);
          if (rankValue !== undefined && rankValue >= points) {
            tierName += i;
          }
        }
        await Rank.findByIdAndUpdate(
          rank._id,
          { rank: "Silver", tier: tierName },
          { new: true },
        );
        break;
      }
      case points <= 50000: {
        let tierName = "Gold";
        for (let i = 0; i < 5; i++) {
          const rankValue = rankPoints.get(tierName + i);
          if (rankValue !== undefined && rankValue >= points) {
            tierName += i;
          }
        }
        await Rank.findByIdAndUpdate(
          rank._id,
          { rank: "Gold", tier: tierName },
          { new: true },
        );
        break;
      }
      case points <= 100000: {
        let tierName = "Platinum";
        for (let i = 0; i < 5; i++) {
          const rankValue = rankPoints.get(tierName + i);
          if (rankValue !== undefined && rankValue >= points) {
            tierName += i;
          }
        }
        await Rank.findByIdAndUpdate(
          rank._id,
          { rank: "Platinum", tier: tierName },
          { new: true },
        );
        break;
      }
      case points <= 200000: {
        let tierName = "Diamond";
        for (let i = 0; i < 5; i++) {
          const rankValue = rankPoints.get(tierName + i);
          if (rankValue !== undefined && rankValue >= points) {
            tierName += i;
          }
        }
        await Rank.findByIdAndUpdate(
          rank._id,
          { rank: "Diamond", tier: tierName },
          { new: true },
        );
        break;
      }
      case points <= 1000000: {
        await Rank.findByIdAndUpdate(
          rank._id,
          { rank: "Masters" },
          { new: true },
        );
        break;
      }
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

/**
 * Updates the rank given the number of points and a short description of the reason for the points gained/lost
 *
 * @param {number} points - The number of points that is going to be gained or lost
 * @param {string} desc - The short description of the reason for updating the rank
 */
async function updateRank(points: number, desc: string): Promise<void> {
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

/**
 * Determines the number of points for not finishing the timer
 *
 * @param {number} remaining - The remaining time in minutes
 * @param {string} type - The timer type
 * @returns {number} The total number of points to lose
 */
function determineLosePointsNotFocus(remaining: number, type: string): number {
  /**
   * lose more points for not completing focuses in case user decides to not
   * take break and finish focusing
   */
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
 * Gets the rank collection in an object that can be used and read
 *
 * @returns {Promise< IRank | undefined >} the rank object that corresponds to the user
 */
export async function getRank(): Promise<IRank | undefined> {
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

/**
 * when the user logins, they gain some points (more if consecutive)
 *
 * @param {number} consecutive_days - The total consecutive days the user has been logged in for
 */
export async function login(consecutive_days: number): Promise<void> {
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
 * when the user is focusing, they gain points via the amount they have spent
 * focusing
 * @param time - Time in minutes
 * @param marathon - to determine whether focus is via a marathon focus or not
 */
export async function focusing(time: number, marathon: boolean): Promise<void> {
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

/**
 * Updates the rank collection to reflect the points gained from finishing the break
 *
 * @param {boolean} marathon - Flag that determines if the break was from a marathon breeak timer
 */
export async function finishedBreak(marathon: boolean): Promise<void> {
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

/**
 * Updates the rank collection to reflect the points lost from losing a streak
 *
 * @param {number} streak - The consecutive days the user has been logged in for
 */
export async function brokeStreak(streak: number): Promise<void> {
  try {
    await connectDB();

    const points = determineLoseStreakPoints(streak);
    updateRank(-points, "broke login streak");
  } catch (error) {
    console.error(error);
  }
}

/**
 * Update rank collection to reflect the points lost from not finishing the timer
 *
 * @param remaining - The remaining time
 * @param type - The timer type that is currently unfinished
 */
export async function notFinish(
  remaining: number,
  type: string,
): Promise<void> {
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

/**
 * Updates the rank collection to reflect the points lost from pausing the focus too many times (The default is 3 or more pauses)
 */
export async function pausedFocus(): Promise<void> {
  try {
    await connectDB();
    updateRank(-100, "paused focus");
  } catch (error) {
    console.error(error);
  }
}

/**
 * Gets all the rank logs
 *
 * @returns {Promise<IRankLog[] | undefined>} The rank logs sorted by when the rank log was created (latest is first)
 */
export async function getRankLogs(): Promise<IRankLog[] | undefined> {
  try {
    await connectDB();
    return JSON.parse(JSON.stringify(await RankLog.find().sort({ time: -1 })));
  } catch (error) {
    console.error(error);
  }
}

/**
 * The interface for grouped rank logs
 */
export interface GroupedSortedRanks {
  _id: string;
  documents: IRankLog[];
}

/**
 * @returns {GroupedSortedRanks[]} An array of documents grouped by the days
 */
export async function getSortedRanks(): Promise<
  GroupedSortedRanks[] | undefined
> {
  try {
    await connectDB();

    const allRankLogs = await RankLog.find().sort({ time: -1 });
    const diff: number = compareTwoDates(
      allRankLogs[0].time,
      allRankLogs[allRankLogs.length - 1].time,
    );

    let sortedRanks: GroupedSortedRanks[] = [];

    // show by day
    if (diff < 20) {
      sortedRanks = await RankLog.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
            documents: { $push: "$$ROOT" },
          },
        },
        {
          $sort: { _id: -1 },
        },
      ]);
    }
    // show by months
    else if (diff < 366) {
      sortedRanks = await RankLog.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$time" } },
            documents: { $push: "$$ROOT" },
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $project: {
            _id: 1,
            documents: {
              $sortArray: {
                input: "$documents",
                sortBy: { time: -1 }, // Sort by the `time` field in descending order (most recent first)
              },
            },
          },
        },
      ]);
    }
    // show by year
    else {
      sortedRanks = await RankLog.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y", date: "$time" } },
            documents: { $push: "$$ROOT" },
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $project: {
            _id: 1,
            documents: {
              $sortArray: {
                input: "$documents",
                sortBy: { time: -1 }, // Sort by the `time` field in descending order (most recent first)
              },
            },
          },
        },
      ]);
    }
    return JSON.parse(JSON.stringify(sortedRanks));
  } catch (error) {
    console.error(error);
  }
}
