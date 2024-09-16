import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const id = Number(params.id);

	if (isNaN(id)) {
		return new NextResponse("Invalid ID", {
			status: 400,
		});
	}

	const todo = fakeUsers.find((u) => u.id === id);

	if (!user) {
		return new NextResponse("User not found", {
			status: 404,
		});
	}

	return new NextResponse(JSON.stringify(user), {
		status: 200,
	});
}
