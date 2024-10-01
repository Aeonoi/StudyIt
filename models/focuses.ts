import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface IFocus extends Document {
  _id: string;
  createdDate: Date;
  time: number;
  task: string; // ObjectId (string) of a task
  completed: boolean;
}

export const FocusesSchema = new mongoose.Schema({
  createdDate: {
    type: Date,
    required: true,
  },
  time: {
    type: Number,
    required: true,
    default: 0,
  },
  task: {
    type: String,
    required: false,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Focuses =
  mongoose.models.Focuses || mongoose.model<IFocus>("Focuses", FocusesSchema);
export default Focuses;
