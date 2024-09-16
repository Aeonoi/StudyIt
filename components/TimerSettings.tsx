import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface Props {
	openSettings: boolean;
	setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>;
	focusTime: number;
	setFocusTime: React.Dispatch<React.SetStateAction<number>>;
	breakTime: number;
	setBreakTime: React.Dispatch<React.SetStateAction<number>>;
	marathonTime: number;
	setMarathonTime: React.Dispatch<React.SetStateAction<number>>;
	marathonBreakTime: number;
	setMarathonBreakTime: React.Dispatch<React.SetStateAction<number>>;
	setRemainingTime: React.Dispatch<React.SetStateAction<number>>;
	timerType: string;
}

const TimerSettings = ({
	openSettings,
	setOpenSettings,
	focusTime,
	setFocusTime,
	breakTime,
	setBreakTime,
	marathonTime,
	marathonBreakTime,
	setMarathonTime,
	setMarathonBreakTime,
	setRemainingTime,
	timerType,
}: Props) => {
	const convertMinutesToMs = (time: number): number => {
		return time * 1000 * 60;
	};

	const convertMsToMinutes = (time: number): number => {
		return time / 60000;
	};

	const handleChanges = () => {
		setFocusTime(settingsFocusTime);
		setBreakTime(settingsBreakTime);
		setMarathonTime(settingsMarathonTime);
		setMarathonBreakTime(settingsMarahtonBreakTime);
		switch (timerType) {
			case "FOCUS":
				setRemainingTime(settingsFocusTime);
				break;
			case "BREAK":
				setRemainingTime(settingsBreakTime);
				break;
			case "MARATHON":
				setRemainingTime(settingsMarathonTime);
				break;
			case "MARATHONBREAK":
				setRemainingTime(settingsMarathonTime);
				break;
		}
		setOpenSettings(!openSettings);
	};

	const [settingsFocusTime, setSettingsFocusTime] = useState(focusTime);
	const [settingsBreakTime, setSettingsBreakTime] = useState(breakTime);
	const [settingsMarathonTime, setSettingsMarathonTime] =
		useState(marathonTime);
	const [settingsMarahtonBreakTime, setSettingsMarathonBreakTime] =
		useState(marathonBreakTime);

	// biome-ignore lint/correctness/useExhaustiveDependencies: the settings should not retain if we exit out of the settings dialog
	useEffect(() => {
		setSettingsFocusTime(focusTime);
		setSettingsMarathonTime(marathonTime);
		setSettingsBreakTime(breakTime);
		setSettingsMarathonBreakTime(marathonBreakTime);
	}, [openSettings]);

	// TODO: Be able to set colors/themes
	return (
		<Dialog open={openSettings} onOpenChange={setOpenSettings}>
			<DialogContent className="sm:max-w-[425px] bg-pink-50">
				<DialogHeader>
					<DialogTitle className="text-center">Timer Settings</DialogTitle>
					<DialogDescription>Focus Settings</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="grid grid-rows-2">
							<h2>Focus Time</h2>
							<Input
								min={1}
								max={999}
								type="number"
								value={convertMsToMinutes(settingsFocusTime)}
								onChange={(val) =>
									setSettingsFocusTime(
										convertMinutesToMs(Number(val.target.value)),
									)
								}
							/>
						</div>
						<div className="grid grid-rows-2">
							<h2>Break Time</h2>
							<Input
								min={1}
								max={999}
								type="number"
								value={convertMsToMinutes(settingsBreakTime)}
								onChange={(val) =>
									setSettingsBreakTime(
										convertMinutesToMs(Number(val.target.value)),
									)
								}
							/>
						</div>
					</div>
				</div>
				<DialogHeader>
					<DialogDescription>Marathon Settings</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="grid grid-rows-2">
							<h2>Focus Time</h2>
							<Input
								min={1}
								max={999}
								type="number"
								value={convertMsToMinutes(settingsMarathonTime)}
								onChange={(val) =>
									setSettingsMarathonTime(
										convertMinutesToMs(Number(val.target.value)),
									)
								}
							/>
						</div>
						<div className="grid grid-rows-2">
							<h2>Break Time</h2>
							<Input
								min={1}
								max={999}
								type="number"
								value={convertMsToMinutes(settingsMarahtonBreakTime)}
								onChange={(val) =>
									setSettingsMarathonBreakTime(
										convertMinutesToMs(Number(val.target.value)),
									)
								}
							/>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={() => handleChanges()}>Ok</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default TimerSettings;
