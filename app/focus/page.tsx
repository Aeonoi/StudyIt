"use client";
import BottomNavbar from "@/components/BottomNavbar";
import Navbar from "@/components/Navbar";
import Timer from "@/components/Timer";
import { useEffect, useState } from "react";
import type React from "react";

/* The elements of the focus page */
const FocusPage: React.FC = () => {
	// timer
	const [timeRemaining, setTimeRemaining] = useState<number>(1500000);
	const [pause, setPause] = useState<boolean>(true);

	useEffect(() => {
		if (!pause && timeRemaining > 0) {
			const timer = setInterval(
				// can't set to lower than 4ms because browsers have a limit
				() => setTimeRemaining(timeRemaining - 10),
				10,
			);
			return () => clearInterval(timer);
		}
	}, [pause, timeRemaining]);
	//////////////////////////////////////////////////////

	const [openSettings, setOpenSettings] = useState<boolean>(false);
	const [textareaVisible, setTextareaVisible] = useState<boolean>(false);
	const [textareaValue, setTextareaValue] = useState<string>("");

	return (
		<main>
			<div className="grid gap-y-10">
				<Navbar />
				<div
					className={`grid ${textareaVisible ? "grid-cols-2" : "grid-cols-1"}`}
				>
					<Timer
						time={timeRemaining}
						setTimeRemaining={setTimeRemaining}
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
			/>
		</main>
	);
};
export default FocusPage;
