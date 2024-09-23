// get API KEY: https://console.cloud.google.com/apis/credentials
// usage: react-player

// contains the YouTube data API key (replace with key)
const KEY: string | undefined = process.env.YOUTUBE_API_KEY;
// const KEY: string | undefined = "";
const URL_API = "https://www.googleapis.com/youtube/v3/search";
let QUERY = "lofi girl";
const PART = "part=snippet";
const TYPE: string = "video"; // channel, video
const YOUTUBE_VIDEO_URL = "https://www.youtube.com/watch?v=";
const MAX_RESULTS = 20;

// downloads the yotuube video as mp3

// defines type for returned json
interface YoutubeAPITypes {
  kind: "youtube#searchResult";
  etag: string;
  id: {
    kind: string;
    videoId: string;
    channelId: string;
    playlistId: string;
  };
  snippet: {
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      string: {
        url: string;
        // unsigned
        width: number;
        // unsigned
        height: number;
      };
    };
    channelTitle: string;
    liveBroadcastContent: string;
  };
}

// DOCS: https://developers.google.com/youtube/v3/docs/search/list#go
// @return: array of youtube url
export async function fetchVideos(query: string) {
  QUERY = query;
  const url = `${URL_API}?key=${KEY}&q=${QUERY}&type=${TYPE}&${PART}&maxResults=${MAX_RESULTS}`;
  const data = await fetch(url, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Reponse status: ${response.status} with message: ${response}`,
        );
      }
      return response.json();
    })
    .then((content) => {
      const youtube_videos: string[] = new Array();
      content.items.map((video: YoutubeAPITypes) => {
        youtube_videos.push(`${YOUTUBE_VIDEO_URL}${video.id.videoId}`);
      });
      console.log(youtube_videos);
      return youtube_videos;
    })
    .catch((error) => {
      console.error(`Error: ${error}`);
    });
  return data;
}
