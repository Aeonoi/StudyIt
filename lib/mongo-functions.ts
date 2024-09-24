"use server";
// https://stackoverflow.com/questions/77091418/warning-only-plain-objects-can-be-passed-to-client-components-from-server-compo
import connectDB from "./connect-mongo";
import Task, { ITask } from "@/models/tasks";
import SuperTask, { ISuperTask } from "@/models/superTasks";

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

export async function deleteTask(id: string) {
  try {
    await connectDB();
  } catch (error) {
    console.error(error);
  }
}
