import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface ISubject extends Document {
  _id: string;
  name: string;
  lastDone: Date;
  completedSessions: number;
  totalSessions: number;
}

/*
 * Either school subjects or OTHER which will not be a part of this category
 *
 *  - School Subject
 *  - Other (anything other than a school subject)
 *  - All: Retains all information of all (updated all the time)
 * */
export const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  lastDone: {
    type: Date,
  },

  completedSessions: {
    type: Number,
  },

  totalSessions: {
    type: Number,
  },
});

const Subject =
  mongoose.models.Task || mongoose.model<ISubject>("Subject", SubjectSchema);
export default Subject;
