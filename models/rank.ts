/**
 *  Ranks:
 *    - Iron: 0 - 1,000
 *    - Bronze: 1,000 - 10,000
 *    - Silver: 10,000 - 20,000
 *    - Gold: 20,000 - 50,000
 *    - Platinum: 50,000 - 100,000
 *    - Diamond: 100,000 - 200,000
 *    - Masters: 200,000 - 1,000,000
 *    - Mythical: 1,000,000 - ...
 *
 *
 */
import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface IRank extends Document {
  _id: string;
  rank: string;
  points: number;
  tier: number;
}

export const RankSchema = new mongoose.Schema({
  rank: {
    type: String,
    required: true,
    default: "Iron",
  },
  // goes (lowest tier) 5 - 1 (highest tier)
  tier: {
    type: Number,
    required: true,
    default: 5,
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Rank = mongoose.models.Rank || mongoose.model<IRank>("Rank", RankSchema);
export default Rank;
