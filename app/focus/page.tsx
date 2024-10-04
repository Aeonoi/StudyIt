"use client";
import BottomNavbar from "@/components/BottomNavbar";
import GoogleSearch from "@/components/GoogleSearch";
import Navbar from "@/components/Navbar";
import PreventLeave from "@/components/PreventLeave";
import Timer from "@/components/Timer";
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
      <PreventLeave timerOn={!pause} />
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
            <textarea
              placeholder="Enter some notes"
              id="text"
              name="text"
              rows={5}
              className="text-wrap rounded-l visible max-w-md overflow-hidden"
              style={{ resize: "none" }}
              value={textareaValue}
              onChange={(val) => setTextareaValue(val.target.value)}
            />
          )}
        </div>
      </div>
      {/* Bottom of the page, have toggles that bring up the google search or notepad */}
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
