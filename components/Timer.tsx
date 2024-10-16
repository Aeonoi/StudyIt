// TODO: use useState to set the different colors for each timer, usefuil for changing theme/colors from settings
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
  finishFocus,
} from "@/lib/mongo-functions";
import { convertMsToMinutes } from "@/lib/useful-functions";
import { finishedBreak, focusing, notFinish, pausedFocus } from "@/lib/rank";

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

  const [numberOfPauses, setNumberOfPauses] = useState<number>(0);

  // make up for the lost time

  useEffect(() => {
    if (!pauseState && time > 0) {
      const timeDec = 350;
      const timer = setInterval(async () => {
        setTime(time - timeDec);
        setElapsedTime((prev) => prev + timeDec);
      }, timeDec);

      return () => clearInterval(timer);

      // const dec = 100000;
      // const testTimer = setInterval(async () => {
      //   setTime(time - dec);
      //   setElapsedTime((prev) => prev + dec);
      // }, 350);
      // return () => clearInterval(testTimer);
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
    updateTask(currentSelectedTask, convertMsToMinutes(elapsedTime), timerType);
    updateSuperTask(convertMsToMinutes(elapsedTime), timerType);
    if (timerType === "FOCUS" || timerType === "MARATHON") {
      // debug_print([elapsedTime.toString()]);
      updateFocus(currentFocus, convertMsToMinutes(elapsedTime));
      // update the rank points
      focusing(convertMsToMinutes(elapsedTime), timerType === "MARATHON");
    }
    setElapsedTime(0);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: only thing that matters is the time to check for auto start
  useEffect(() => {
    const check = async () => {
      // reset focus
      setCurrentFocus("");
      // timer finished
      update();
      switch (timerType) {
        case "FOCUS": {
          setPauseAction(true);
          setTime(breakTime);
          setTimerType("BREAK");
          setCurrentColor("bg-chart-1");
          setStarted(false);
          completeTask(currentSelectedTask);
          completeFocusSuperTask();
          finishFocus(currentFocus);
          const audio = new Audio("/sounds/hotel-bell-ding-1-174457.mp3");
          audio.play();
          break;
        }
        case "BREAK": {
          setPauseAction(true);
          setTime(focusTime);
          setTimerType("FOCUS");
          setCurrentColor("bg-chart-5");
          setStarted(false);
          completeBreak(currentSelectedTask);
          completeBreakSuperTask();
          finishedBreak(false);
          const audio = new Audio("/sounds/hotel-bell-ding-5-202589.mp3");
          audio.play();
          break;
        }
        case "MARATHON": {
          setPauseAction(false);
          setTime(marathonBreakTime);
          setTimerType("MARATHONBREAK");
          setCurrentColor("bg-chart-1");
          setStarted(true);
          completeTask(currentSelectedTask);
          startBreak(currentSelectedTask);
          completeFocusSuperTask();
          const audio = new Audio("/sounds/microwave-timer-117077.mp3");
          audio.play();
          finishFocus(currentFocus);
          break;
        }
        case "MARATHONBREAK": {
          setPauseAction(false);
          setTime(marathonTime);
          setTimerType("MARATHON");
          setCurrentColor("bg-chart-3");
          setStarted(true);
          completeBreak(currentSelectedTask);
          startTask(currentSelectedTask);
          completeBreakSuperTask();
          finishedBreak(true);
          setCurrentFocus(await createFocus(currentSelectedTask));
          const audio = new Audio("/sounds/hotel-bell-ding-5-202589.mp3");
          audio.play();
          break;
        }
      }
      setNumberOfPauses(0);
    };
    if (time <= 0) {
      check();
    }
  }, [time]);

  // set color of the circle timer
  const [currentColor, setCurrentColor] = useState("bg-chart-5");

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
    setNumberOfPauses(0);
    if (started) {
      notFinish(getRemainingTime(), timerType);
    }
  };

  // get the remaining time
  const getRemainingTime = (): number => {
    switch (timerType.toLowerCase()) {
      case "focus":
        return focusTime - time;
      case "break":
        return breakTime - time;
      case "marathon":
        return marathonTime - time;
      case "marathonbreak":
        return marathonBreakTime - time;
      default:
        return 0;
    }
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
            className="bg-background text-foreground border border-foreground"
            onClick={() => {
              setTime(focusTime);
              setCurrentColor("bg-chart-5");
              setTimerType("FOCUS");
              reset();
            }}
          >
            Focus
          </Button>
          <Button
            className="bg-background text-foreground border border-foreground"
            onClick={() => {
              setTime(marathonTime);
              setCurrentColor("bg-chart-3");
              setTimerType("MARATHON");
              reset();
            }}
          >
            Marathon
          </Button>
          <Button
            className="bg-background text-foreground border border-foreground"
            onClick={() => {
              setTime(breakTime);
              setCurrentColor("bg-chart-1");
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
              currentFocus === "" &&
              (timerType === "FOCUS" || timerType === "MARATHON")
            ) {
              setCurrentFocus(await createFocus(currentSelectedTask));
            }
            if (started && pauseState) {
              if (numberOfPauses >= 3) {
                pausedFocus();
              }
              setNumberOfPauses((prev) => prev + 1);
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
