"use server";

import Todo from "@/models/todo";
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

// called on application start and sorts the todos by closed date and checks if there are any that need to be completed
export async function checkTodos() { }

// create a toast notification telling user that one or more todo dates have been reached
export async function notify() { }
