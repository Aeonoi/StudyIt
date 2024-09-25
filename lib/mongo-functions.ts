"use server";
// https://stackoverflow.com/questions/77091418/warning-only-plain-objects-can-be-passed-to-client-components-from-server-compo
import connectDB from "./connect-mongo";
import Task, { ITask } from "@/models/tasks";
import SuperTask, { ISuperTask } from "@/models/superTasks";
import Login, { ILogin } from "@/models/logins";
import mongoose from "mongoose";
import { compareTwoDates } from "./useful-functions";

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
      totalStudyingTime: 0,
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

/* Increments the number of sessions a task has completed (old += 1) */
export async function completedTask(id: string, elapsedTime: number) {
  try {
    await connectDB();
    const currentTask = await Task.findById(id);
    const task = await Task.findByIdAndUpdate(
      id,
      {
        completedSessions: currentTask.completedSessions + 1,
        totalStudyingTime: currentTask.totalStudyingTime + elapsedTime,
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

// Checks whether the collection exists
export async function CheckLoginCollection() {
  await connectDB();

  console.log("Checking login collection here...");
  const collections = mongoose.connection.collections;

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // checks the number of consecutive days from previous document (sorted)
  const checkConsecutiveDays = async (): Promise<number> => {
    // returns array sorted with latest date as first entry
    const logins = await Login.find({ loginTime: { $lt: currentDate } }).sort({
      loginTime: -1,
    });

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
