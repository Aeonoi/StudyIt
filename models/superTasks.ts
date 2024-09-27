import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface ISuperTask extends Document {
  _id: string;
  name?: string;
  completedSessions?: number;
  completedBreaks?: number;
  totalBreaks?: number;
  totalFocusTime?: number;
  totalBreakTime?: number;
}

export const SuperTasksSchema = new mongoose.Schema({
  // name of the task
  name: {
    type: String,
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

const SuperTask =
  mongoose.models.SuperTask ||
  mongoose.model<ISuperTask>("SuperTask", SuperTasksSchema);
export default SuperTask;
