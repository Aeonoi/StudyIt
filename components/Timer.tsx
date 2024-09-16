import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import TimerSettings from "./TimerSettings";

interface Prop {
	time: number;
	setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
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

// TODO: surround the timer clock with a progress bar
/* Controls the entire card containing the timer and the timer */
const Timer = ({
	time,
	setTimeRemaining,
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

	const [timerType, setTimerType] = useState<string>("focus");

	useEffect(() => {
		if (openSettingsState === true) {
			setPauseAction(true);
		}
	}, [openSettingsState, setPauseAction]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: only thing that matters is the time to check for auto start
	useEffect(() => {
		// TODO: Keep track that session has been completed
		if (time <= 0) {
			// TODO: Play a sound when changing to a different timer
			switch (timerType) {
				case "FOCUS":
					setPauseAction(true);
					setTimeRemaining(breakTime);
					setTimerType("BREAK");
					setCurrentColor("bg-blue-500");
					break;
				case "BREAK":
					setPauseAction(true);
					setTimeRemaining(focusTime);
					setTimerType("FOCUS");
					setCurrentColor("bg-red-100");
					break;
				case "MARATHON":
					setPauseAction(false);
					setTimeRemaining(marathonBreakTime);
					setTimerType("MARATHONBREAK");
					setCurrentColor("bg-blue-500");
					break;
				case "MARATHONBREAK":
					setPauseAction(false);
					setTimeRemaining(marathonTime);
					setTimerType("MARATHON");
					setCurrentColor("bg-orange-300");
					break;
			}
			// do not auto start instead, it will display the focus break time instead
			if (timerType === "FOCUS") {
			}
			// auto start using the marathon break time
			if (timerType === "MARATHON") {
			}
			if (timerType === "BREAK") {
			}
		}
	}, [time]);

	// set color of the circle timer
	const [currentColor, setCurrentColor] = useState("bg-red-100");

	// TODO: use useState to set the different colors for each timer, usefuil for changing theme/colors from settings

	return (
		<Card className="max-w-md mx-auto my-auto shadow-md overflow-hidden">
			<CardHeader className="grid grid-cols-3 content-evenly gap-3 items-center justify-center">
				<Button
					onClick={() => {
						setTimeRemaining(focusTime);
						setCurrentColor("bg-red-100");
						setTimerType("FOCUS");
						setPauseAction(true);
					}}
				>
					Focus
				</Button>
				<Button
					onClick={() => {
						setTimeRemaining(marathonTime);
						setCurrentColor("bg-orange-300");
						setTimerType("MARATHON");
						setPauseAction(true);
					}}
				>
					Marathon
				</Button>
				<Button
					onClick={() => {
						setTimeRemaining(breakTime);
						setCurrentColor("bg-blue-500");
						setTimerType("BREAK");
						setPauseAction(true);
					}}
				>
					Break
				</Button>
			</CardHeader>
			<CardContent>
				<Button
					variant="outline"
					className={`font-bold text-white text-7xl rounded-full ${currentColor} flex items-center justify-center font-mono `}
					style={{ width: "100%", height: "100%", aspectRatio: "1/1" }}
					onClick={() => setPauseAction(!pauseState)}
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
				setRemainingTime={setTimeRemaining}
				timerType={timerType}
			/>
		</Card>
	);
};

export default Timer;
