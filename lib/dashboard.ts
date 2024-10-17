"use server";

import SuperTask from "@/models/superTasks";
import Login from "@/models/logins";
import type { ISuperTask } from "@/models/superTasks";
import type { ILogin } from "@/models/logins";
import connectDB from "./connect-mongo";
import {
  compareTwoDates,
  debug_print,
  getGroupedTotalFocusTime,
} from "./useful-functions";
import Task from "@/models/tasks";
import type { ITask } from "@/models/tasks";
import {
  getGroupedFocusesByDay,
  getGroupedFocusesByMonth,
  getGroupedFocusesByYear,
  getUniqueDates,
  type GroupedFocuses,
} from "./mongo-functions";

// key-value pair
export interface TaskFocus {
  name: string;
  value: number;
}

export async function getTotalMinutesStudied(): Promise<number | undefined> {
  try {
    await connectDB();
    const supertask: ISuperTask = (await SuperTask.find())[0];

    if (supertask?.totalFocusTime) {
      return supertask.totalFocusTime;
    }
    return 0;
  } catch (error) {
    console.error(error);
  }
}

export async function getTotalMinutesBreak(): Promise<number | undefined> {
  try {
    await connectDB();
    const supertask: ISuperTask = (await SuperTask.find())[0];

    if (supertask?.totalBreakTime) {
      return supertask.totalBreakTime;
    }
    return 0;
  } catch (error) {
    console.error(error);
  }
}

export async function totalLogins() {}

export async function getLoginStreak(): Promise<number | undefined> {
  try {
    await connectDB();
    // get latest time at top
    const login: ILogin = (await Login.find({}).sort({ loginTime: -1 }))[0];

    if (!login || !login.consecutiveDays) {
      return 1;
    }

    return login.consecutiveDays;
  } catch (error) {
    console.error(error);
  }
}

/**
 * @returns Average studying time in minutes
 */
export async function averageStudyTime(): Promise<number | undefined> {
  try {
    await connectDB();

    const supertask: ISuperTask = (await SuperTask.find())[0];

    if (supertask?.completedSessions && supertask.totalFocusTime) {
      return Number(
        (supertask.totalFocusTime / supertask.completedSessions).toFixed(2),
      );
    }
    return 0;
  } catch (error) {
    console.error(error);
  }
}

export async function getTotalLoginDays(): Promise<number | undefined> {
  try {
    await connectDB();
    const uniqueLogins: ILogin[] = await getUniqueDates();

    if (uniqueLogins) {
      return uniqueLogins.length;
    }
    return 0;
  } catch (error) {
    console.error(error);
  }
}

// sum of all task's studying time
export async function getTotalStudyingTime(): Promise<number | undefined> {
  try {
    await connectDB();

    const supertask: ISuperTask = (await SuperTask.find())[0];
    return Number(supertask.totalFocusTime.toFixed(2));
  } catch (error) {
    console.error(error);
  }
}

//////////////////////////////////////////////////////////////////////
// Chart                                                            //
//////////////////////////////////////////////////////////////////////

/**
 * @returns All tasks with their name and their total focus time
 */
export async function getAllTasks(): Promise<TaskFocus[] | undefined> {
  try {
    await connectDB();
    const tasks: ITask[] = await Task.find();
    const ret: TaskFocus[] = new Array();

    tasks.map(async (item) => {
      ret.push({
        name: item.name,
        value: Number(item.totalFocusTime.toFixed(2)),
      });
    });
    return ret;
  } catch (error) {
    console.error(error);
  }
}

export async function getTotalFocusTime(): Promise<TaskFocus[] | undefined> {
  try {
    await connectDB();
    let allFocuses: GroupedFocuses[] = await getGroupedFocusesByDay();
    const ret: TaskFocus[] = new Array();
    // case of having no/few focuses

    // no focuses
    if (allFocuses.length === 0) {
      return [];
    }
    if (allFocuses.length === 1) {
      return [
        {
          name: allFocuses[0]._id,
          value: getGroupedTotalFocusTime(allFocuses[0].documents),
        },
      ];
    }
    if (allFocuses.length === 2) {
      return [
        {
          name: allFocuses[0]._id,
          value: getGroupedTotalFocusTime(allFocuses[0].documents),
        },
        {
          name: allFocuses[1]._id,
          value: getGroupedTotalFocusTime(allFocuses[1].documents),
        },
      ];
    }

    // compare the first and last ._id and see if they are different in 30 days or more
    const focus1: GroupedFocuses = allFocuses[0];
    const focus2: GroupedFocuses = allFocuses[allFocuses.length - 1];
    const difference: number = compareTwoDates(
      new Date(focus1._id),
      new Date(focus2._id),
    );

    // if more than one month difference, show in months
    if (1 < Math.floor(difference / 30) && Math.floor(difference / 30) <= 12) {
      allFocuses = await getGroupedFocusesByMonth();
    }
    // more than 12 months difference, show years
    else if (Math.floor(difference / 30) > 12) {
      allFocuses = await getGroupedFocusesByYear();
    }
    // default shows by days
    allFocuses.reverse().map((groupedFocuses) => {
      ret.push({
        name: groupedFocuses._id,
        value: Number(
          getGroupedTotalFocusTime(groupedFocuses.documents).toFixed(2),
        ),
      });
    });
    return ret;
    // check the first and last focus
  } catch (error) {
    console.error(error);
  }
}
