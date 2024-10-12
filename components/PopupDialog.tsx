import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogFooter } from "./ui/dialog";

interface Props {
  children: React.ReactNode;
  isOpened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopupDialog: React.FC<Props> = ({ children, isOpened, setOpened }) => {
  return (
    <Dialog open={isOpened} onOpenChange={setOpened}>
      <DialogContent>
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
