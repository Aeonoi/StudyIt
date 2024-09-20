import { Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ITask } from "@/models/tasks";
import { createTask, getAllTasks } from "@/lib/mongo-functions";

const API_URL = "http://localhost:3000/api";

interface Props {
  setCurrentSelectedTask: React.Dispatch<React.SetStateAction<string>>;
  started: boolean;
}

export default function SelectTask({
  setCurrentSelectedTask,
  started,
}: Props): JSX.Element {
  const [open, setOpen] = React.useState(false);

  // holds the selected id
  const [value, setValue] = React.useState<string>("");
  // holds the selected name
  const [name, setName] = React.useState<string>("");

  // biome-ignore lint/correctness/useExhaustiveDependencies: only fetch when the menu is open
  useEffect(() => {
    fetchAllTasks();
  }, [open]);

  async function fetchAllTasks() {
    setAllTasks(await getAllTasks());
  }

  // empty array
  const [allTasks, setAllTasks] = React.useState<ITask[]>([]);
  // tracks the input value of the search/create command
  const commandInputRef = useRef<null | HTMLInputElement>(null);

  // TODO: Have a scroll when the list becomes too large (> 5)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? allTasks.find((task) => task._id === value)?.name
            : "Select task..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            ref={commandInputRef}
            placeholder="Search/Create task"
          />
          <CommandEmpty>
            <Button
              variant="ghost"
              onClick={async () => {
                if (
                  commandInputRef.current?.value &&
                  commandInputRef.current.value !== name
                ) {
                  console.log(await createTask(commandInputRef.current.value));
                  fetchAllTasks();
                }
              }}
            >
              Create task
            </Button>
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {allTasks.map((task) => (
                <CommandItem
                  key={task._id}
                  value={task.name}
                  onSelect={(currentName) => {
                    // TODO: Add support for allowing to switch to a different task, currently does not allow to switch tasks
                    if (!started) {
                      setValue(currentName === name ? "" : task._id);
                      setName(currentName === name ? "" : currentName);
                      setOpen(false);
                      setCurrentSelectedTask(
                        currentName === name ? "" : task._id,
                      );
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      name === task.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {task.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
