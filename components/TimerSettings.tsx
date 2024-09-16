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
}: Props) => {
	const convertMinutesToMs = (time: number): number => {
		return time * 1000 * 60;
	};

	const convertMsToMinutes = (time: number): number => {
		return time / 60000;
	};
	// TODO: Save settings with only OK button press
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
								value={convertMsToMinutes(focusTime)}
								onChange={(val) =>
									setFocusTime(convertMinutesToMs(Number(val.target.value)))
								}
							/>
						</div>
						<div className="grid grid-rows-2">
							<h2>Break Time</h2>
							<Input
								min={1}
								max={999}
								type="number"
								value={convertMsToMinutes(breakTime)}
								onChange={(val) =>
									setBreakTime(convertMinutesToMs(Number(val.target.value)))
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
								value={convertMsToMinutes(marathonTime)}
								onChange={(val) =>
									setMarathonTime(convertMinutesToMs(Number(val.target.value)))
								}
							/>
						</div>
						<div className="grid grid-rows-2">
							<h2>Break Time</h2>
							<Input
								min={1}
								max={999}
								type="number"
								value={convertMsToMinutes(marathonBreakTime)}
								onChange={(val) =>
									setMarathonBreakTime(
										convertMinutesToMs(Number(val.target.value)),
									)
								}
							/>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={() => setOpenSettings(!openSettings)}>Ok</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default TimerSettings;
