import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "../app/globals.css";

interface Props {
  openSearch: boolean;
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const GoogleSearch = ({ openSearch, setOpenSearch }: Props): JSX.Element => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: only do it when search button is pressed
  useEffect(() => {
    const script = document.createElement("script");
    const cse_url = process.env.GOOGLE_CSE;
    if (cse_url) {
      script.src = cse_url;
      script.async = true;
      document.body.appendChild(script);
    } else {
      console.error("CSE undefined");
    }
    return () => {
      document.body.removeChild(script);
    };
  }, [openSearch]);

  return (
    <Dialog open={openSearch} onOpenChange={setOpenSearch}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] bg-background overflow-auto">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Google Custom Search</DialogDescription>
        </DialogHeader>

        <div className="gcse-searchbox" />

        <div className="mt-4">
          <div className="gcse-searchresults" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default GoogleSearch;
