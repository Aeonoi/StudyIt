import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	return new NextResponse(JSON.stringify("hello"), {
		status: 200,
	});
}

export async function POST() {}
