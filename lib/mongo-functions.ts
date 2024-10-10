"use server";
// https://stackoverflow.com/questions/77091418/warning-only-plain-objects-can-be-passed-to-client-components-from-server-compo
import connectDB from "./connect-mongo";
import Task from "@/models/tasks";
import type { ITask } from "@/models/tasks";
import SuperTask from "@/models/superTasks";
import type { ISuperTask } from "@/models/superTasks";
import Login from "@/models/logins";
import type { ILogin } from "@/models/logins";
import mongoose from "mongoose";
import { compareTwoDates } from "./useful-functions";
import Focuses from "@/models/focuses";
import type { IFocus } from "@/models/focuses";
import Rank from "@/models/rank";
import { brokeStreak, login } from "./rank";
import RankLog, { type IRankLog } from "@/models/ranklog";
import Todo from "@/models/todo";

// TODO: Add field to track marathon and normal focus sessions

/* Returns all the tasks that have been created so far */
export async function getAllTasks() {
  try {
    await connectDB();
    const allTasks = await Task.find();
    return JSON.parse(JSON.stringify(allTasks));
  } catch (error) {
    console.error(error);
  }
}

/**
 * @param id - The id of the task that it is associated with (optional)
 */
export async function createFocus(id = "") {
  try {
    await connectDB();
    const focus = await Focuses.create({
      createdDate: new Date(),
      time: 0,
      task: id,
      completed: false,
    });
    return focus._id.toString();
  } catch (error) {
    console.error(error);
  }
}

export async function updateFocus(id: string, time: number) {
  try {
    if (id === "") {
      return;
    }
    await connectDB();
    const focus = await Focuses.findById(id);
    await Focuses.findByIdAndUpdate(
      id,
      { time: focus.time + time },
      {
        new: true,
      },
    );
  } catch (error) {
    console.error(error);
  }
}

export async function updateFocusTask(id: string, taskId: string) {
  try {
    if (id === "" || taskId === "") {
      return;
    }
    await connectDB();
    const task = await Task.findById(taskId);
    // check if taskId provided is correct
    if (task) {
      await Focuses.findByIdAndUpdate(id, { task: taskId }, { new: true });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function finishFocus(id: string) {
  try {
    if (id === "") {
      return;
    }
    await connectDB();
    await Focuses.findByIdAndUpdate(id, { completed: true }, { new: true });
  } catch (error) {
    console.error(error);
  }
}

export async function getFocus(id: string) {
  try {
    if (id === "") {
      return;
    }
    await connectDB();
    return JSON.parse(JSON.stringify(await Focuses.findById(id)));
  } catch (error) {
    console.error(error);
  }
}

/* Create a task and returns the json of task */
export async function createTask(name: string) {
  try {
    await connectDB();
    const newTask = await Task.create({
      name: name,
      // placeholder values
      createdDate: new Date(),
      lastDone: new Date(1980, 1, 1),
      completedSessions: 0,
      totalSessions: 0,
      completedBreaks: 0,
      totalBreaks: 0,
      totalFocusTime: 0,
      totalBreakTime: 0,
    });
    return JSON.parse(JSON.stringify(newTask));
  } catch (error) {
    console.error(error);
  }
}

/* Updates the number of sessions a task has undergone */
export async function startTask(id: string) {
  try {
    if (id === "") {
      return;
    }
    await connectDB();
    const currentTask: ITask | null = await Task.findById(id);
    if (currentTask) {
      await Task.findByIdAndUpdate(
        id,
        { totalSessions: currentTask.totalSessions + 1 },
        { new: true },
      );
    }
  } catch (error) {
    console.error(error);
  }
}

/* Increments the number of sessions a task has completed (old += 1) */
export async function completeTask(id: string) {
  try {
    if (id === "") {
      return;
    }
    await connectDB();
    const currentTask = await Task.findById(id);
    const task = await Task.findByIdAndUpdate(
      id,
      {
        completedSessions: currentTask.completedSessions + 1,
        lastDone: new Date(),
      },
      { new: true },
    );
    console.log(JSON.parse(JSON.stringify(task)));
  } catch (error) {
    console.error(error);
  }
}

/* Updates a task time */
export async function updateTask(id: string, time: number, type: string) {
  try {
    if (id === "") {
      return;
    }
    await connectDB();
    const currentTask = await Task.findById(id);
    if (type === "BREAK" || type === "MARATHONBREAK") {
      const task = await Task.findByIdAndUpdate(
        id,
        {
          totalBreakTime: currentTask.totalBreakTime + time,
        },
        { new: true },
      );
    }
    if (type === "FOCUS" || type === "MARATHON") {
      const task = await Task.findByIdAndUpdate(
        id,
        {
          totalFocusTime: currentTask.totalFocusTime + time,
        },
        { new: true },
      );
    }
  } catch (error) {
    console.error(error);
  }
}

// TODO: Remove task
export async function deleteTask(id: string) {
  try {
    await connectDB();
  } catch (error) {
    console.error(error);
  }
}

export async function getTask(id: string) {
  try {
    if (id === "") {
      return;
    }
    await connectDB();
    return JSON.parse(JSON.stringify(await Task.findById(id)));
  } catch (error) {
    console.error(error);
  }
}

export async function updateSuperTask(time: number, type: string) {
  try {
    await connectDB();
    await CheckSuperTaskCollection();
    const supertask: ISuperTask = (await SuperTask.find())[0];
    const id: string = supertask._id;
    if (type === "FOCUS" || type === "MARATHON") {
      await SuperTask.findByIdAndUpdate(
        id,
        { totalFocusTime: supertask.totalFocusTime + time },
        { new: true },
      );
    } else if (type === "BREAK" || type === "MARATHONBREAK") {
      await SuperTask.findByIdAndUpdate(
        id,
        { totalBreakTime: supertask.totalBreakTime + time },
        { new: true },
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export async function completeFocusSuperTask() {
  try {
    await connectDB();
    await CheckSuperTaskCollection();
    const supertask: ISuperTask = (await SuperTask.find())[0];
    const id: string = supertask._id;
    await SuperTask.findByIdAndUpdate(
      id,
      { completedSessions: supertask.completedSessions + 1 },
      { new: true },
    );
  } catch (error) {
    console.error(error);
  }
}

export async function completeBreakSuperTask() {
  try {
    await connectDB();
    await CheckSuperTaskCollection();
    const supertask: ISuperTask = (await SuperTask.find())[0];
    const id: string = supertask._id;
    await SuperTask.findByIdAndUpdate(
      id,
      { completedBreaks: supertask.completedBreaks + 1 },
      { new: true },
    );
  } catch (error) {
    console.error(error);
  }
}

export async function getSupertask() {
  try {
    await connectDB();
    return JSON.parse(JSON.stringify((await SuperTask.find())[0]));
  } catch (error) {
    console.error(error);
  }
}

/* Updates the tottal number of breaks  */
export async function startBreak(id: string) {
  try {
    if (id === "") {
      return;
    }
    await connectDB();
    const currentTask = await Task.findById(id);
    await Task.findByIdAndUpdate(
      id,
      { totalBreaks: currentTask.totalBreaks + 1 },
      { new: true },
    );
  } catch (error) {
    console.error(error);
  }
}

export async function completeBreak(id: string) {
  try {
    if (id === "") {
      return;
    }
    await connectDB();
    const currentTask = await Task.findById(id);
    console.log("------------------------------------------");
    console.log(currentTask);
    const task = await Task.findByIdAndUpdate(
      id,
      { completedBreaks: currentTask.completedBreaks + 1 },
      { new: true },
    );
    console.log(task);
    console.log("------------------------------------------");
  } catch (error) {
    console.error(error);
  }
}

// Checks whether the login collection exists
export async function CheckLoginCollection() {
  await connectDB();

  console.log("Checking login collection here...");
  const collections = mongoose.connection.collections;

  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0);

  const lastLogin: ILogin = (
    await Login.find({}).sort({
      loginTime: -1,
    })
  )[0];

  // checks the number of consecutive days from previous document (sorted)
  const checkConsecutiveDays = async (): Promise<number> => {
    // returns array sorted with latest date as first entry
    const logins: ILogin[] = await Login.find({
      loginTime: { $lt: currentDate },
    }).sort({
      loginTime: -1,
    });
    // check if there are logins
    if (
      logins.length !== 0 &&
      logins[0].consecutiveDays &&
      compareTwoDates(currentDate, logins[0].loginTime) === 1
    ) {
      return logins[0].consecutiveDays + 1;
    }
    // broke streak
    const oldStreak = logins[logins.length - 1].consecutiveDays;
    if (logins.length > 1 && oldStreak > 1) {
      brokeStreak(oldStreak);
    }
    return 1;
  };

  let exists = false;
  for (const collection in collections) {
    // make sure collection exists
    if (collection === "logins") {
      exists = true;
      console.log("logins collection exists");
      break;
    }
  }

  if (!exists) {
    await Login.createCollection();
  }
  const days = await checkConsecutiveDays();
  if (compareTwoDates(lastLogin.loginTime, currentDate) !== 0) {
    await Login.create({
      loginTime: new Date(),
      consecutiveDays: days,
    });
    await login(days);
  }
}

// Checks whether the super task collection exists
export async function CheckSuperTaskCollection() {
  await connectDB();

  const collections = mongoose.connection.collections;

  let exists = false;
  for (const collection in collections) {
    // make sure collection exists
    if (collection === "supertasks") {
      exists = true;
      console.log("supertasks collection exists");
      break;
    }
    console.log(collection);
  }

  if (!exists) {
    // Contains only one document that is used that contains all information
    await SuperTask.createCollection();
  }
  const supertasks = await SuperTask.find();
  if (supertasks.length === 0) {
    await SuperTask.create({
      name: "Super Task",
      completedSessions: 0,
      totalSessions: 0,
      completedBreaks: 0,
      totalBreaks: 0,
      totalFocusTime: 0,
      totalBreakTime: 0,
    });
  }
}

// Checks if the rank collection is created
export async function CheckRankCollection() {
  await connectDB();
  const collections = mongoose.connection.collections;

  let rank_exists = false;
  let log_exists = false;
  for (const collection in collections) {
    // make sure collection exists
    if (collection === "ranks") {
      rank_exists = true;
      console.log("ranks collection exists");
    }
    if (collection === "ranklogs") {
      log_exists = true;
      console.log("rank logs collection exists");
    }
    console.log(collection);
  }

  if (!rank_exists) {
    // Contains only one document that is used that contains all information
    await Rank.createCollection();
  }
  if (!log_exists) {
    await RankLog.createCollection();
  }
  const ranks = await Rank.find();
  if (ranks.length === 0) {
    await Rank.create({
      rank: "Bronze",
      points: 0,
    });
  }
}

export async function getUniqueDates() {
  const uniqueDates: ILogin[] = await Login.aggregate([
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$loginTime" },
          month: { $month: "$loginTime" },
          year: { $year: "$loginTime" },
        },
        uniqueDate: { $first: "$loginTime" },
      },
    },
    {
      $sort: { uniqueDate: 1 }, // Sorting the dates in ascending order
    },
    {
      $project: {
        _id: 0,
        uniqueDate: 1,
      },
    },
  ]);

  return uniqueDates;
}

export interface GroupedFocuses {
  _id: string; // date
  documents: IFocus[];
}

/**
 * @returns An array of JSON objects with _id being the date sorted by days
 */
export async function getGroupedFocusesByDay() {
  const focuses: GroupedFocuses[] = await Focuses.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdDate" } },
        documents: { $push: "$$ROOT" },
      },
    },
    {
      $sort: { _id: -1 },
    },
  ]);

  return focuses;
}

/**
 * @returns An array of JSON objects with _id being the date sorted by months
 */
export async function getGroupedFocusesByMonth() {
  const focuses: GroupedFocuses[] = await Focuses.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdDate" } },
        documents: { $push: "$$ROOT" },
      },
    },
    {
      $sort: { _id: -1 },
    },
  ]);

  return focuses;
}

/**
 * @returns An array of JSON objects with _id being the date sorted by year
 */
export async function getGroupedFocusesByYear() {
  const focuses: GroupedFocuses[] = await Focuses.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y", date: "$createdDate" } },
        documents: { $push: "$$ROOT" },
      },
    },
    {
      $sort: { _id: -1 },
    },
  ]);

  return focuses;
}

export async function getRankLogs(): Promise<IRankLog[] | undefined> {
  try {
    await connectDB();
    return JSON.parse(JSON.stringify(await RankLog.find().sort({ time: -1 })));
  } catch (error) {
    console.error(error);
  }
}

export async function createTodo(
  title: string,
  dueDate: string,
  priority: string,
  description: string,
) {
  try {
    await connectDB();
    const date = new Date(dueDate);
    // Store date in local timezone
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    console.log(utcDate);
    await Todo.create({
      name: title,
      createdDate: new Date(),
      dueDate: utcDate,
      priority: priority,
      description: description,
    });
    console.log("success");
  } catch (error) {
    console.error(error);
  }
}
