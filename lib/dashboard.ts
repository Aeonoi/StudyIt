"use server";

import SuperTask from "@/models/superTasks";
import Login from "@/models/logins";
import type { ISuperTask } from "@/models/superTasks";
import type { ILogin } from "@/models/logins";
import connectDB from "./connect-mongo";
import { convertSecondsToMinutes } from "./useful-functions";
import Task from "@/models/tasks";
import type { ITask } from "@/models/tasks";
import { getUniqueDates } from "./mongo-functions";

interface Tasks {
  name: string;
  hours: number;
}

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

// TODO: Returns the number of unique login dates
export async function totalLogins() { }

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

// @returns Average studying time in minutes
export async function averageStudyTime(): Promise<number | undefined> {
  try {
    await connectDB();

    const supertask: ISuperTask = (await SuperTask.find())[0];

    if (supertask?.completedSessions && supertask.totalFocusTime) {
      return convertSecondsToMinutes(
        supertask.totalFocusTime / supertask.completedSessions,
      );
    }
    return 0;
  } catch (error) {
    console.error(error);
  }
}

// @returns All tasks with their name and their total focus time
export async function getAllTasks(): Promise<TaskFocus[] | undefined> {
  try {
    await connectDB();
    const tasks: ITask[] = await Task.find();
    // const ret: Tasks[] = new Array();
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

    const tasks: ITask[] = await Task.find();

    let total = 0;
    tasks.map((task) => {
      if (task.totalFocusTime) {
        total += task.totalFocusTime;
      }
    });
    return total;
  } catch (error) {
    console.error(error);
  }
}
