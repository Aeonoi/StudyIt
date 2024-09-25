import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface ILogin extends Document {
  _id: string;
  name: string;
  loginTime: Date;
  consecutiveDays: number;
}

export const LoginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  loginTime: {
    type: Date,
    required: true,
  },
  // keeps track of how many consecutive days from this specific login/sign in
  consecutiveDays: {
    type: Number,
    required: true,
  },
});

const Login =
  mongoose.models.Todo || mongoose.model<ILogin>("Login", LoginSchema);
export default Login;
