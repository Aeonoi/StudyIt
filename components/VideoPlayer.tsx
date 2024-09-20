import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { fetchVideos } from "@/lib/youtube";
import {
  PauseIcon,
  PlayIcon,
  SkipForwardIcon,
  SkipBackIcon,
} from "lucide-react";
import ReactPlayer from "react-player";

const VideoPlayer = (): JSX.Element => {
  const [pauseMusic, setPauseMusic] = useState<boolean>(true);
  const [videos, setVideos] = useState<string[][]>([
    ["https://www.youtube.com/watch?v=kavLNr-PyoY"],
  ]);

  // only fetch on start of page
  useEffect(() => {
    const fetchVideosFunc = async () => {
      const data = await fetchVideos("lofi girl");
      if (data) {
        setVideos(data);
      }
    };
    fetchVideosFunc();
  }, []);

  // controls the current video index array of **videos**
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

  // TODO: Add slider for audio
  return (
    <Card>
      <Button
        variant={"ghost"}
        onClick={() => {
          currentVideoIndex === 0
            ? setCurrentVideoIndex(videos.length - 1)
            : setCurrentVideoIndex((prev) => prev - 1);
        }}
      >
        <SkipBackIcon />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => {
          setPauseMusic(!pauseMusic);
        }}
      >
        {!pauseMusic && <PauseIcon />}
        {pauseMusic && <PlayIcon />}
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => {
          currentVideoIndex === videos.length - 1
            ? setCurrentVideoIndex(0)
            : setCurrentVideoIndex((prev) => prev + 1);
        }}
      >
        <SkipForwardIcon />
      </Button>
      <ReactPlayer
        url={videos[currentVideoIndex][0]}
        width={0}
        height={0}
        playing={!pauseMusic}
      />
    </Card>
  );
};

export default VideoPlayer;
