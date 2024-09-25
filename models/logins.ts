import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface ILogin extends Document {
  _id: string;
  loginTime: Date;
  consecutiveDays?: number;
}

export const LoginSchema = new mongoose.Schema({
  loginTime: {
    type: Date,
    required: true,
    default: new Date(),
  },
  // keeps track of how many consecutive days from this specific login/sign in
  consecutiveDays: {
    type: Number,
    required: false,
  },
});

const Login =
  mongoose.models.Todo || mongoose.model<ILogin>("Login", LoginSchema);
export default Login;
