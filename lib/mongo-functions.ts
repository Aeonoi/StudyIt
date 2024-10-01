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

// @param id - The id of the task that it is associated with (optional)
export async function createFocus(id = "") {
  try {
    await connectDB();
    return await Focuses.create({
      createdDate: new Date(),
      time: 0,
      task: id,
      completed: false,
    });
  } catch (error) {
    console.error(error);
  }
}

// @param id - The id that is associated with a focus
export async function updateFocus(id: string, content: Partial<IFocus>) {
  try {
    await connectDB();
    await Focuses.findByIdAndUpdate(id, content, { new: true });
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

export async function updateSuperTask(content: Partial<ISuperTask>) {
  try {
    await connectDB();
    await CheckSuperTaskCollection();
    const supertask: ISuperTask = (await SuperTask.find())[0];
    const id: string = supertask._id;
    await SuperTask.findByIdAndUpdate(id, content, { new: true });
  } catch (error) {
    console.error(error);
  }
}

// updates the last done date for a certain task
export async function updateDate(id: string) {
  try {
    await connectDB();
    await Task.findByIdAndUpdate(id, { lastDone: new Date() }, { new: true });
  } catch (error) {
    console.error(error);
  }
}

/* Increments the number of sessions a task has completed (old += 1) */
export async function completedTask(id: string, elapsedTime: number) {
  try {
    await connectDB();
    const currentTask = await Task.findById(id);
    const task = await Task.findByIdAndUpdate(
      id,
      {
        completedSessions: currentTask.completedSessions + 1,
        totalFocusTime: currentTask.totalFocusTime + elapsedTime,
        lastDone: new Date(),
      },
      { new: true },
    );
    console.log(JSON.parse(JSON.stringify(task)));
  } catch (error) {
    console.error(error);
  }
}

/* Updates the tottal number of breaks  */
export async function startBreak(id: string) {
  try {
    await connectDB();
    const currentTask = await Task.findById(id);
    await Task.findByIdAndUpdate(
      id,
      { totalSessions: currentTask.totalSessions + 1 },
      { new: true },
    );
  } catch (error) {
    console.error(error);
  }
}

/* Increments the number of breaks that has been completed (old += 1) */
export async function completeBreak(id: string, elapsedTime: number) {
  try {
    await connectDB();
    const currentTask = await Task.findById(id);
    const task = await Task.findByIdAndUpdate(
      id,
      {
        completedSessions: currentTask.completedSessions + 1,
        totalTime: currentTask.totalTime + elapsedTime,
      },
      { new: true },
    );
    console.log(JSON.parse(JSON.stringify(task)));
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

// Checks whether the login collection exists
export async function CheckLoginCollection() {
  await connectDB();

  console.log("Checking login collection here...");
  const collections = mongoose.connection.collections;

  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0);

  // checks the number of consecutive days from previous document (sorted)
  const checkConsecutiveDays = async (): Promise<number> => {
    // returns array sorted with latest date as first entry
    const logins: ILogin[] = await Login.find({
      loginTime: { $lt: currentDate },
    }).sort({
      loginTime: -1,
    });

    console.log("-----------------------------");
    console.log(logins[0].loginTime);
    console.log(currentDate);
    console.log("-----------------------------");

    // check if there are logins
    if (
      logins.length !== 0 &&
      logins[0].consecutiveDays &&
      compareTwoDates(currentDate, logins[0].loginTime)
    ) {
      return logins[0].consecutiveDays + 1;
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
  await Login.create({
    loginTime: new Date(),
    consecutiveDays: days,
  });
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
