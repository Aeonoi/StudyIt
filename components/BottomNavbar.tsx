import { Button } from "./ui/button";
import { Notebook, Search, SettingsIcon } from "lucide-react";
import { Card } from "./ui/card";
import VideoPlayer from "./VideoPlayer";

interface Props {
  textareaState: boolean;
  setTextareaVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

/* For focus mode */
const BottomNavbar = ({
  textareaState,
  setTextareaVisible,
  setOpenSettings,
}: Props) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-end p-4 gap-3">
      <Card>
        <Button
          variant="ghost"
          onClick={() => setTextareaVisible(!textareaState)}
        >
          <Notebook />
        </Button>
        <Button variant="ghost">
          <Search />
        </Button>
        <Button variant="ghost" onClick={() => setOpenSettings(true)}>
          <SettingsIcon />
        </Button>
      </Card>
      {/* FIXME: Error: Hydration failed because the initial UI does not match what was rendered on the server. */}
      <VideoPlayer />
    </nav>
  );
};
export default BottomNavbar;
