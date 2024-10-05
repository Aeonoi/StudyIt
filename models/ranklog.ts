import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface IRankLog extends Document {
  _id: string;
  points: number;
  time: Date;
  description: string;
}

export const RankLogSchema = new mongoose.Schema({
  points: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
});

const RankLog =
  mongoose.models.RankLog || mongoose.model<IRankLog>("RankLog", RankLogSchema);
export default RankLog;
