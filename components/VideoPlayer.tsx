import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { fetchVideos } from "@/lib/youtube";
import {
  PauseIcon,
  PlayIcon,
  SkipForwardIcon,
  SkipBackIcon,
  VolumeIcon,
  Volume1Icon,
  Volume2Icon,
} from "lucide-react";
import ReactPlayer from "react-player";
import { Slider } from "./ui/slider";

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

  const [volumeSliderVisible, setVolumeSliderVisible] =
    useState<boolean>(false);

  // 0 to 1
  const [volume, setVolume] = useState<number>(0.2);

  // TODO: Add slider for audio
  return (
    <Card
      className={`grid ${volumeSliderVisible ? "grid-cols-5" : "grid-cols-4"}`}
    >
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
      <Button
        variant={"ghost"}
        onClick={() => setVolumeSliderVisible(!volumeSliderVisible)}
      >
        {volume > 0.45 && <Volume2Icon />}
        {volume > 0 && volume < 0.45 && <Volume1Icon />}
        {volume === 0 && <VolumeIcon />}
      </Button>
      {volumeSliderVisible && (
        <Slider
          defaultValue={[volume * 100]}
          max={100}
          step={1}
          className={cn("w-[100%]")}
          onChange={(val) => console.log(val)}
          onValueChange={(val) => setVolume(val[0] / 100)}
        />
      )}
      <ReactPlayer
        url={videos[currentVideoIndex][0]}
        width={0}
        height={0}
        volume={volume}
        playing={!pauseMusic}
        onEnded={() => setPauseMusic(true)}
      />
    </Card>
  );
};

export default VideoPlayer;
