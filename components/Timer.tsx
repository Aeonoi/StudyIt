// TODO: Marathons should be included for focuses created
// TODO: use useState to set the different colors for each timer, usefuil for changing theme/colors from settings
// TODO: surround the timer clock with a progress bar
// TODO: Play a sound when changing to a different timer
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import TimerSettings from "./TimerSettings";
import SelectTask from "./SelectTask";
import {
  completeTask,
  createFocus,
  startBreak,
  startTask,
  updateSuperTask,
  completeBreak,
  updateTask,
  updateFocus,
  completeFocusSuperTask,
  completeBreakSuperTask,
} from "@/lib/mongo-functions";
import {
  convertMsToMinutes,
  convertMsToSeconds,
  debug_print,
} from "@/lib/useful-functions";
import { finishedBreak, focusing } from "@/lib/rank";

interface Prop {
  pauseState: boolean;
  setPauseAction: React.Dispatch<React.SetStateAction<boolean>>;
  openSettingsState: boolean;
  setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

/*
 * calculates the time of the timer
 * https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
 * */
const calculateTime = (time: number): string => {
  const minutes = Math.floor(time / 60000);
  const seconds = Number(((time % 60000) / 1000).toFixed(0));
  const fixedSeconds = `0${seconds}`;
  return seconds === 60
    ? `${minutes + 1}:00`
    : `${minutes}:${seconds < 10 ? fixedSeconds : seconds}`;
};

/* Controls the entire card containing the timer and the timer */
const Timer = ({
  pauseState,
  setPauseAction,
  openSettingsState,
  setOpenSettings,
}: Prop): JSX.Element => {
  // focus/marathon times and break times
  const [focusTime, setFocusTime] = useState<number>(1500000);
  const [breakTime, setBreakTime] = useState<number>(300000);
  const [marathonTime, setMarathonTime] = useState<number>(7200000);
  const [marathonBreakTime, setMarathonBreakTime] = useState<number>(900000);

  const [timerType, setTimerType] = useState<string>("FOCUS");

  // contains the id that correlates with the current focus
  const [currentFocus, setCurrentFocus] = useState<string>("");

  // time that is shown to the user
  const [time, setTime] = useState<number>(1500000);
  // stores the total time focused before updating documents
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // make up for the lost time

  useEffect(() => {
    if (!pauseState && time > 0) {
      const timeDec = 350;
      const timer = setInterval(async () => {
        setTime(time - timeDec);
        setElapsedTime((prev) => prev + timeDec);
      }, timeDec);

      const dec = 10000000;
      const testTimer = setInterval(async () => {
        setTime(time - dec);
        setElapsedTime((prev) => prev + dec);
      }, 350);
      // return () => clearInterval(timer);
      return () => clearInterval(testTimer);
    }
  }, [pauseState, time]);

  // pause timer when opening settings
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (openSettingsState === true) {
      setPauseAction(true);
    }
  }, [openSettingsState]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (pauseState && elapsedTime > 0) {
      update();
    }
  }, [pauseState]);

  const update = async () => {
    updateTask(currentSelectedTask, convertMsToSeconds(elapsedTime), timerType);
    updateSuperTask(convertMsToSeconds(elapsedTime), timerType);
    if (timerType === "FOCUS" || timerType === "MARATHON") {
      // debug_print([elapsedTime.toString()]);
      updateFocus(currentFocus, convertMsToSeconds(elapsedTime));
      // update the rank points
      focusing(convertMsToMinutes(elapsedTime), timerType === "MARATHON");
    }
    setElapsedTime(0);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: only thing that matters is the time to check for auto start
  useEffect(() => {
    // timer finished
    if (time <= 0) {
      update();
      switch (timerType) {
        case "FOCUS":
          setPauseAction(true);
          setTime(breakTime);
          setTimerType("BREAK");
          setCurrentColor("bg-blue-500");
          setStarted(false);
          completeTask(currentSelectedTask);
          completeFocusSuperTask();
          break;
        case "BREAK":
          setPauseAction(true);
          setTime(focusTime);
          setTimerType("FOCUS");
          setCurrentColor("bg-red-100");
          setStarted(false);
          completeBreak(currentSelectedTask);
          completeBreakSuperTask();
          finishedBreak(false);
          break;
        case "MARATHON":
          setPauseAction(false);
          setTime(marathonBreakTime);
          setTimerType("MARATHONBREAK");
          setCurrentColor("bg-blue-500");
          setStarted(true);
          completeTask(currentSelectedTask);
          startBreak(currentSelectedTask);
          completeFocusSuperTask();
          break;
        case "MARATHONBREAK":
          setPauseAction(false);
          setTime(marathonTime);
          setTimerType("MARATHON");
          setCurrentColor("bg-orange-300");
          setStarted(true);
          completeBreak(currentSelectedTask);
          startTask(currentSelectedTask);
          completeBreakSuperTask();
          finishedBreak(true);
          break;
      }
    }
  }, [time]);

  // set color of the circle timer
  const [currentColor, setCurrentColor] = useState("bg-red-100");

  const [currentSelectedTask, setCurrentSelectedTask] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only care about when the task has been started
  useEffect(() => {
    if (started && (timerType === "MARATHON" || timerType === "FOCUS")) {
      startTask(currentSelectedTask);
    }
  }, [started]);

  // reset the states
  const reset = () => {
    setPauseAction(true);
    setStarted(false);
    setCurrentFocus("");
    setElapsedTime(0);
  };

  return (
    <Card className="max-w-md mx-auto my-auto shadow-md overflow-hidden">
      <CardHeader className="grid grid-rows-2 items-center justify-center">
        <div className="flex items-center justify-center">
          <SelectTask
            started={started}
            setCurrentSelectedTask={setCurrentSelectedTask}
          />
        </div>
        <div className="grid grid-cols-3 gap-3 items-center justify-center">
          <Button
            onClick={() => {
              setTime(focusTime);
              setCurrentColor("bg-red-100");
              setTimerType("FOCUS");
              reset();
            }}
          >
            Focus
          </Button>
          <Button
            onClick={() => {
              setTime(marathonTime);
              setCurrentColor("bg-orange-300");
              setTimerType("MARATHON");
              reset();
            }}
          >
            Marathon
          </Button>
          <Button
            onClick={() => {
              setTime(breakTime);
              setCurrentColor("bg-blue-500");
              setTimerType("BREAK");
              reset();
            }}
          >
            Break
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className={`font-bold text-white text-7xl rounded-full ${currentColor} flex items-center justify-center font-mono `}
          style={{ width: "100%", height: "100%", aspectRatio: "1/1" }}
          onClick={async () => {
            setPauseAction(!pauseState);
            setStarted(true);
            if (currentSelectedTask && timerType === "BREAK") {
              startBreak(currentSelectedTask);
            }
            if (
              (currentFocus === "" && timerType === "FOCUS") ||
              timerType === "MARATHON"
            ) {
              setCurrentFocus(await createFocus(currentSelectedTask));
            }
          }}
        >
          {calculateTime(time)}
        </Button>
      </CardContent>
      <TimerSettings
        openSettings={openSettingsState}
        setOpenSettings={setOpenSettings}
        focusTime={focusTime}
        setFocusTime={setFocusTime}
        breakTime={breakTime}
        setBreakTime={setBreakTime}
        marathonTime={marathonTime}
        setMarathonTime={setMarathonTime}
        marathonBreakTime={marathonBreakTime}
        setMarathonBreakTime={setMarathonBreakTime}
        setRemainingTime={setTime}
        timerType={timerType}
      />
    </Card>
  );
};

export default Timer;
