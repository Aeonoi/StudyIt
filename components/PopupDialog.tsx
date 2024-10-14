import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogFooter } from "./ui/dialog";

interface Props {
  children: React.ReactNode;
  title: string;
  isOpened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopupDialog: React.FC<Props> = ({
  children,
  title,
  isOpened,
  setOpened,
}) => {
  return (
    <Dialog open={isOpened} onOpenChange={setOpened}>
      <DialogContent>
        <DialogTitle className="text-center">{title}</DialogTitle>
        <DialogDescription style={{ visibility: "hidden" }} />
        {children}
        <DialogFooter>
          <Button variant={"default"} onClick={() => setOpened(false)}>
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PopupDialog;
