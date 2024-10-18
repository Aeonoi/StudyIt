import type { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  timerOn: boolean;
  wroteNotes: boolean;
}

/**
 * Alerts user when the user is switching pages or is refreshing page when timer is on and/or
 * there are notes written in the textarea in the focus/page
 */
const PreventLeave: React.FC<Props> = ({ timerOn, wroteNotes }) => {
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (timerOn || wroteNotes) {
        event.preventDefault();
      }
    };

    const handleLeave = (url?: string) => {
      if (
        (timerOn || wroteNotes) &&
        !confirm(
          "Are you sure you want to leave this page? Current progress and notes will be lost.",
        )
      ) {
        // Cancel navigation
        return false;
      }
      return true;
    };

    // Add event listener for page refresh/unload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Intercept route changes
    const originalPush = router.push;

    router.push = async (url: string, options?: NavigateOptions) => {
      console.log(options);
      const allowNavigation = handleLeave(url);
      if (allowNavigation) {
        // If confirmed, proceed with navigation
        return originalPush(url, options);
      }
      // If not confirmed, do nothing
      return false;
    };

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.push = originalPush; // Restore original push behavior
    };
  }, [timerOn, wroteNotes, router]);

  return null;
};
export default PreventLeave;
