import { useEffect } from "react";

interface Props {
  timerOn: boolean;
}

// currently only works on reloading or closing tab (or browser)
const PreventLeave: React.FC<Props> = ({ timerOn }) => {
  useEffect(() => {
    const handle = (event: BeforeUnloadEvent) => {
      if (timerOn) {
        const confirmationMessage = "Hello, please lock in";
        console.log("here");
        return confirmationMessage;
      }
    };
    window.addEventListener("beforeunload", handle);

    return () => {
      window.removeEventListener("beforeunload", handle);
    };
  }, [timerOn]);
  return null;
};
export default PreventLeave;
