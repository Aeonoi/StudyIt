import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { fetchVideos } from "@/lib/youtube";
import { shuffleArray } from "@/lib/useful-functions";

interface Props {
  openSettings: boolean;
  setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>;
  audioPreferences: string[];
  setAudioPreferences: React.Dispatch<React.SetStateAction<string[]>>;
  audios: string[];
  setAudio: React.Dispatch<React.SetStateAction<string[]>>;
}

const AudioSettings = ({
  openSettings,
  setOpenSettings,
  audioPreferences,
  setAudioPreferences,
  audios,
  setAudio,
}: Props): JSX.Element => {
  const removePreference = (preference: string) => {
    const updatedPreferences = audioPreferences.filter(
      (item) => item !== preference,
    );
    setAudioPreferences(updatedPreferences);
  };

  const [audioPreferenceName, setAudioPreferenceName] = useState<string>("");

  const addAudioToPlaylist = async (preference: string) => {
    const currentData = await fetchVideos(preference);
    if (currentData) {
      const allAudios = audios.concat(currentData);
      setAudio(shuffleArray(allAudios));
    }
  };

  return (
    <Dialog open={openSettings} onOpenChange={setOpenSettings}>
      <DialogContent className="sm:max-w-[425px] bg-gray-500">
        <DialogHeader>
          <DialogTitle>Audio preferences</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <h2 className="text-blue-500">Current preferences:</h2>
          <ul className="grid gap-4 shadow overflow-hidden sm:rounded-md">
            {audioPreferences.map((preference) => (
              <li key={preference}>
                <div className="grid grid-cols-12">
                  <h3 className="text-lg font-medium text-gray-900 col-span-10">
                    {preference}
                  </h3>
                  <Button
                    variant={"ghost"}
                    className="font-medium text-indigo-600 justify-end hover:bg-transparent col-span-2"
                    onClick={() => removePreference(preference)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-4 py-4">
          <h2 className="text-blue-500">Add audio preference</h2>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              type="text"
              id="name"
              defaultValue=""
              value={audioPreferenceName}
              className="col-span-3"
              placeholder="Enter audio preference"
              onChange={(val) => setAudioPreferenceName(val.target.value)}
            />
            <Button
              onClick={() => {
                if (audioPreferenceName) {
                  setAudioPreferences([
                    ...audioPreferences,
                    audioPreferenceName,
                  ]);
                  addAudioToPlaylist(audioPreferenceName);
                  setAudioPreferenceName("");
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AudioSettings;
