import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter } from "./ui/dialog";
import { forwardRef } from "react";
import { updateTodo } from "@/lib/todo";

interface Props {
  children: React.ReactNode;
  title: string;
  isOpened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  // below props are for rescheduling
  isReschedule?: boolean;
  setChanged?: React.Dispatch<React.SetStateAction<boolean>>;
  ref?: React.Ref<HTMLInputElement>;
  id?: string;
  timeRef?: React.Ref<HTMLInputElement>;
}

const PopupDialog = forwardRef<HTMLInputElement, Props>(
  (
    {
      children,
      title,
      isOpened,
      setOpened,
      isReschedule,
      setChanged,
      id,
      timeRef,
    },
    ref,
  ) => {
    return (
      <Dialog open={isOpened} onOpenChange={setOpened}>
        <DialogContent>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription style={{ visibility: "hidden" }} />
          {children}
          <DialogFooter>
            <Button
              variant={"default"}
              onClick={() => {
                setOpened(false);
                if (isReschedule && setChanged && id) {
                  const update = async () => {
                    if (
                      ref &&
                      "current" in ref &&
                      ref.current &&
                      ref.current.value !== "" &&
                      timeRef &&
                      "current" in timeRef &&
                      timeRef.current &&
                      timeRef.current.value !== ""
                    ) {
                      const date = new Date(ref.current.value);
                      const [hours, minutes] = timeRef.current.value
                        .split(":")
                        .map(Number);
                      updateTodo(id, {
                        dueDate: new Date(
                          date.getTime() +
                          (date.getTimezoneOffset() + minutes + hours * 60) *
                          60000,
                        ),
                      });
                      setChanged(true);
                    }
                  };
                  update();
                }
              }}
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

export default PopupDialog;
