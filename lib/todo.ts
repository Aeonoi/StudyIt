"use server";

import Todo, { type ITodo } from "@/models/todo";
import connectDB from "./connect-mongo";
import type { CalendarEvent } from "@/components/DashboardCalendar";
import moment from "moment";

/**
 * @returns An array of all todos in the default format (same as model)
 */
export async function getAllTodos() {
  try {
    await connectDB();
    return JSON.parse(JSON.stringify(await Todo.find()));
  } catch (error) {
    console.error(error);
  }
}

/**
 * @returns An array of all todos in the calendar event format
 */
export async function getCalendarEvents() {
  try {
    await connectDB();
    const todos = await Todo.find();

    const calendarEvents: CalendarEvent[] = [];

    todos.map((todo) => {
      const currentDate: Date = moment.utc(todo.dueDate).toDate();
      console.log(currentDate);

      calendarEvents.push({
        start: currentDate,
        end: currentDate,
        title: todo.name,
      });
    });
    return JSON.parse(JSON.stringify(calendarEvents));
  } catch (error) {
    console.error(error);
  }
}

/**
 * Removes any todos that have passed their deadlines (more than 3 days)
 */
export async function checkTodos() {
  try {
    await connectDB();
  } catch (error) {
    console.error(error);
  }
}

/**
 * @returns An array of documents that
 */
export async function getNotify(): Promise<ITodo[] | undefined> {
  try {
    await connectDB();

    const todos: ITodo[] = await Todo.find({
      dueDate: {
        $gte: new Date(),
        $lte: new Date(new Date().setDate(new Date().getDate() + 3)),
      },
    }).sort({ priority: -1 });
    console.log(todos);
    return JSON.parse(JSON.stringify(todos));
  } catch (error) {
    console.error(error);
  }
}

export async function getPriority(value: number) {
  let priority = "Low";
  if (value === 1) {
    priority = "Medium";
  } else if (value === 2) {
    priority = "High";
  }
  return priority;
}
