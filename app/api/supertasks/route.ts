import connectDB from "@/lib/connect-mongo";
import {
  CheckSuperTaskCollection,
  updateSuperTask,
} from "@/lib/mongo-functions";
import type { ISuperTask } from "@/models/superTasks";
import { NextResponse } from "next/server";
import SuperTask from "@/models/superTasks";

/* Get all tasks created */
export async function GET() {
  try {
    await connectDB();
    CheckSuperTaskCollection(); // guarentee exists
    const supertask: ISuperTask = (await SuperTask.find())[0];
    // console.log(JSON.parse(JSON.stringify(supertask)));
    return NextResponse.json(supertask, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
  }
}
