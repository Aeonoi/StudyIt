// TODO: Move getPriority function to different file since it requires to be async function
"use server";

import Todo, { type ITodo } from "@/models/todo";
import connectDB from "./connect-mongo";
import type { CustomCalendarEvent } from "@/components/DashboardCalendar";

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

    const calendarEvents: CustomCalendarEvent[] = [];

    todos.map((todo) => {
      const currentDate: Date = todo.dueDate;

      const priority = (value: number) => {
        let priority = "Low";
        if (value === 1) {
          priority = "Medium";
        } else if (value === 2) {
          priority = "High";
        }
        return priority;
      };

      calendarEvents.push({
        start: currentDate,
        end: currentDate,
        title: todo.name,
        id: todo._id,
        description: todo.description,
        priority: priority(todo.priority),
      });
    });
    return JSON.parse(JSON.stringify(calendarEvents));
  } catch (error) {
    console.error(error);
  }
}

export async function updateTodo(id: string, content: Partial<ITodo>) {
  try {
    await connectDB();

    await Todo.findByIdAndUpdate(id, content, { new: true });
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

export async function removeEvent(id: string) {
  try {
    await connectDB();
    await Todo.findByIdAndDelete(id);
  } catch (error) {
    console.error(error);
  }
}

export async function createTodo(
  title: string,
  dueDate: string,
  time: string,
  priority: number,
  description: string,
) {
  try {
    await connectDB();
    const date = new Date(dueDate);
    // Store date in utc timezone
    let [hours, minutes] = [0, 0];
    if (typeof time === "string") {
      [hours, minutes] = time.split(":").map(Number);
    }
    const utcDate = new Date(
      date.getTime() +
      (date.getTimezoneOffset() + minutes + hours * 60) * 60000,
    );
    console.log(utcDate);
    const todo = await Todo.create({
      name: title,
      createdDate: new Date(),
      dueDate: utcDate,
      priority: priority,
      description: description,
    });
    console.log("success");
    return JSON.parse(JSON.stringify(todo));
  } catch (error) {
    console.error(error);
  }
}
