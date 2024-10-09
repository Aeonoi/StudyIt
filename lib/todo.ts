"use server";

import Todo from "@/models/todo";
import connectDB from "./connect-mongo";

export async function getAllTodos() {
  try {
    await connectDB();
    return JSON.parse(JSON.stringify(await Todo.find()));
  } catch (error) {
    console.error(error);
  }
}

// called on application start and sorts the todos by closed date and checks if there are any that need to be completed
export async function checkTodos() { }

// create a toast notification telling user that one or more todo dates have been reached
export async function notify() { }
