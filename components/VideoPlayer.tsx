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

interface YoutubeData {
  url: string;
  title: string;
  id: string;
}

const VideoPlayer = (): JSX.Element => {
  const [pauseMusic, setPauseMusic] = useState<boolean>(true);
  const [videos, setVideos] = useState<string[][]>(new Array());

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

  // TODO: Add slider for audio
  return (
    <Card>
      <Button variant={"ghost"}>
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
      <Button variant={"ghost"}>
        <SkipForwardIcon />
      </Button>
      <ReactPlayer
        // url={videos[0][0]}
        // TODO: REMOVE, IS PLACE HOLDER
        url={"https://www.youtube.com/watch?v=kavLNr-PyoY"}
        width={0}
        height={0}
        playing={!pauseMusic}
      />
    </Card>
  );
};

export default VideoPlayer;
