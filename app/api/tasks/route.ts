import connectDB from "@/lib/connect-mongo";
import { createTask } from "@/lib/mongo-functions";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Task from "@/models/tasks";

export async function GET(req: NextRequest) {
	try {
		await connectDB();
		return new NextResponse(JSON.stringify(new Date()), {
			status: 200,
		});
	} catch (error) {
		console.error(error);
	}
}

export async function POST(req: NextRequest) {
	try {
		await connectDB();
		const body = await req.json();

		// requires name
		if (!body.name) {
			return new NextResponse(JSON.stringify("Task requires a name/title"), {
				status: 400,
			});
		}
		// @returns Task || error
		const task = await createTask(body.name);
		// task
		if (task instanceof Task) {
			return new NextResponse(task, { status: 200 });
		}
		// error
		return new NextResponse(task, { status: 400 });
	} catch (error) {
		console.error(error);
	}
}
