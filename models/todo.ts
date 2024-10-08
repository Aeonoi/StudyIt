import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface ITodo extends Document {
  _id: string;
  name: string;
  createdDate: Date;
  dueDate: Date;
  priority: string;
  description: string;
}

export const TodoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
  priority: {
    type: String,
  },
  description: {
    type: String,
  },
});

const Todo = mongoose.models.Todo || mongoose.model<ITodo>("Todo", TodoSchema);
export default Todo;
