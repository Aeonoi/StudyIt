"use server";
// https://stackoverflow.com/questions/77091418/warning-only-plain-objects-can-be-passed-to-client-components-from-server-compo
import connectDB from "./connect-mongo";
import Task from "@/models/tasks";

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
      // default values
      started: false,
      completed: false,
      createdDate: new Date(),
      lastDone: new Date(1980, 1, 1),
      completedSessions: 0,
      totalSessions: 0,
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
    console.log(JSON.parse(JSON.stringify(currentTask)));
  } catch (error) {
    console.error(error);
  }
}

/* Increments the number of sessions a task has completed (old += 1) */
export async function completedTask(id: string) {
  try {
    await connectDB();
    const currentTask = await Task.findById(id);
    console.log(currentTask);
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
