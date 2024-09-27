import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface ITask extends Document {
  _id: string;
  name: string;
  createdDate: Date;
  lastDone: Date;
  completedSessions: number;
  totalSessions: number;
  completedBreaks: number;
  totalBreaks: number;
  totalFocusTime: number;
  totalBreakTime: number;
}

export const TasksSchema = new mongoose.Schema({
  // name of the task
  name: {
    type: String,
    required: true,
  },
  // when the task was created
  createdDate: {
    type: Date,
    required: true,
  },
  // represents when last finished a session
  lastDone: {
    type: Date,
    required: true,
  },
  // number of sessions completed
  completedSessions: {
    type: Number,
    min: 0,
    required: true,
  },
  // total number of sessions (started)
  totalSessions: {
    type: Number,
    min: 0,
    required: true,
  },
  // completed breaks
  completedBreaks: {
    type: Number,
    min: 0,
    required: true,
  },
  // total number of breaks
  totalBreaks: {
    type: Number,
    min: 0,
    required: true,
  },
  // total studying time in seconds
  totalFocusTime: {
    type: Number,
    min: 0,
    required: true,
  },
  // total break time in seconds
  totalBreakTime: {
    type: Number,
    min: 0,
    required: true,
  },
});

const Task = mongoose.models.Task || mongoose.model<ITask>("Task", TasksSchema);
export default Task;
