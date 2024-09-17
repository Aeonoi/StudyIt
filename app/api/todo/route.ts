import connectDB from "@/lib/connect-mongo";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	try {
		await connectDB();
		return new NextResponse(JSON.stringify("hello"), {
			status: 200,
		});
	} catch (error) {
		return console.error(error);
	}
}

export async function POST(req: NextRequest) {}
