import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// interface for the json returned from POST
interface Youtube {
  url: string;
  id: string;
}

/* Create the mp3 of youtube video */
export async function POST(req: NextRequest) {
  try {
    const json: Youtube = await req.json();
    // const url = json.url;
    // const id = json.id;
    //
    // if (!ytdl.validateURL(url)) {
    //   return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    // }
    //
    // const info = await ytdl.getInfo(id);
    // const format = ytdl.chooseFormat(info.formats, { quality: "134" });
    // if (!format) {
    //   return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    // }
    //
    // const stream = ytdl(url, { filter: "audioonly" });
    //
    // const writer = fs.createWriteStream("video.mp3", {
    //   highWaterMark: 16 * 1024,
    // });
    // stream.pipe(writer);
    const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const videoInfo = await ytdl.getInfo(videoUrl);
    const stream = ytdl(videoUrl, { filter: "audioonly" });

    return new NextResponse(JSON.stringify("hello"), { status: 200 });
  } catch (error) {
    console.error(error);
  }
}
