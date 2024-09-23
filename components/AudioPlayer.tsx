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
  Settings2Icon,
} from "lucide-react";
import ReactPlayer from "react-player";
import { Slider } from "./ui/slider";
import AudioSettings from "./AudioSettings";

const AudioPlayer = (): JSX.Element => {
  const [pauseMusic, setPauseMusic] = useState<boolean>(true);
  // FIX: Remove once ready to deploy
  const [videos, setVideos] = useState<string[]>([
    "https://www.youtube.com/watch?v=kavLNr-PyoY",
  ]);

  // controls the current video index array of **videos**
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

  const [volumeSliderVisible, setVolumeSliderVisible] =
    useState<boolean>(false);

  // 0 to 1
  const [volume, setVolume] = useState<number>(0.2);

  const [openSettings, setOpenSettings] = useState<boolean>(false);

  // audio preferences
  const [audioPreferences, setAudioPreferences] = useState<string[]>([]);

  return (
    <Card
      className={`grid ${volumeSliderVisible ? "grid-cols-6" : "grid-cols-5"}`}
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
          console.log(videos);
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
            : setCurrentVideoIndex(currentVideoIndex + 1);
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
      <Button variant={"ghost"} onClick={() => setOpenSettings(true)}>
        <Settings2Icon />
      </Button>
      <AudioSettings
        openSettings={openSettings}
        setOpenSettings={setOpenSettings}
        audioPreferences={audioPreferences}
        setAudioPreferences={setAudioPreferences}
        audios={videos}
        setAudio={setVideos}
      />
      {/* FIX: CORS erorrs */}
      <ReactPlayer
        url={videos[currentVideoIndex]}
        width={0}
        height={0}
        volume={volume}
        playing={!pauseMusic}
        onEnded={() => {
          // setPauseMusic(true);
          currentVideoIndex === videos.length - 1
            ? setCurrentVideoIndex(0)
            : setCurrentVideoIndex((prev) => prev + 1);
        }}
      />
    </Card>
  );
};

export default AudioPlayer;
