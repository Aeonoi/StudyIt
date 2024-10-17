"use client";
import BottomNavbar from "@/components/BottomNavbar";
import GoogleSearch from "@/components/GoogleSearch";
import Navbar from "@/components/Navbar";
import PreventLeave from "@/components/PreventLeave";
import Timer from "@/components/Timer";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type React from "react";

/* The elements of the focus page */
const FocusPage: React.FC = () => {
  const [pause, setPause] = useState<boolean>(true);

  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [textareaVisible, setTextareaVisible] = useState<boolean>(false);
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [openSearch, setOpenSearch] = useState<boolean>(false);

  return (
    <>
      <PreventLeave timerOn={!pause} wroteNotes={textareaValue !== ""} />
      <div className="grid gap-y-10">
        <Navbar />
        <div
          className={`grid ${textareaVisible ? "grid-cols-2" : "grid-cols-1"}`}
        >
          <GoogleSearch openSearch={openSearch} setOpenSearch={setOpenSearch} />
          <Timer
            pauseState={pause}
            setPauseAction={setPause}
            openSettingsState={openSettings}
            setOpenSettings={setOpenSettings}
          />
          {textareaVisible && (
            <Textarea
              placeholder="Place notes here."
              id="text"
              name="text"
              rows={5}
              className="text-wrap visible max-w-sm overflow-hidden bg-background border border-foreground rounded-lg"
              style={{ resize: "none" }}
              value={textareaValue}
              onChange={(val) => setTextareaValue(val.target.value)}
            />
          )}
        </div>
      </div>
      <BottomNavbar
        textareaState={textareaVisible}
        setOpenSettings={setOpenSettings}
        setTextareaVisible={setTextareaVisible}
        setOpenSearch={setOpenSearch}
      />
    </>
  );
};
export default FocusPage;
