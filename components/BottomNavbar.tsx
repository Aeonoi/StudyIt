import { Button } from "./ui/button";
import { Notebook, SearchIcon, SettingsIcon } from "lucide-react";
import { Card } from "./ui/card";
import AudioPlayer from "./AudioPlayer";

interface Props {
  textareaState: boolean;
  setTextareaVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

/* For focus mode */
const BottomNavbar = ({
  textareaState,
  setTextareaVisible,
  setOpenSettings,
  setOpenSearch,
}: Props) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-end p-4 gap-3">
      <Card>
        <Button
          variant="ghost"
          onClick={() => {
            setTextareaVisible(!textareaState);
          }}
        >
          <Notebook />
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setOpenSearch(true);
          }}
        >
          <SearchIcon />
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setOpenSettings(true);
          }}
        >
          <SettingsIcon />
        </Button>
      </Card>
      {/* FIXME: Error: Hydration failed because the initial UI does not match what was rendered on the server. */}
      <AudioPlayer />
    </nav>
  );
};
export default BottomNavbar;
