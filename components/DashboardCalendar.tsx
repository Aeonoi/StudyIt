import { useEffect, useRef, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { removeEvent } from "@/lib/todo";
import PopupDialog from "./PopupDialog";
import { getReadableDate } from "@/lib/useful-functions";
import { Input } from "./ui/input";

export interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
  id: string;
  description: string;
  priority: string;
}

interface Props {
  eventsList: CalendarEvent[];
  setChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const localizer = momentLocalizer(moment);

const DashboardCalendar: React.FC<Props> = ({ eventsList, setChanged }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<
    "month" | "day" | "week" | "work_week" | "agenda"
  >("month");

  // Controls the popup dialog
  const [isOpened, setOpened] = useState<boolean>(false);

  // controls the information
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | undefined>(
    undefined,
  );

  // Handler for navigating to the next or previous time period
  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
  };

  const handleViewChange = (
    view: "month" | "day" | "week" | "work_week" | "agenda",
  ) => {
    setCurrentView(view);
  };

  // Ref to store the Card element
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Detect click outside of Card to close the context menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click was outside the Card (if it exists)
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowContextMenu(false); // Close the context menu
      }
    };
    // Add event listener for mousedown (left click or any click)
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup the event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [position, setPosition] = useState<
    { x: number; y: number } | undefined
  >(undefined);

  const [showReschedule, setShowReschedule] = useState<boolean>(false);
  const rescheduleRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Calendar
        localizer={localizer}
        events={eventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        date={currentDate}
        view={currentView}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        selectable
        views={["month", "week", "day"]} // Allowed views
        components={{
          eventWrapper: ({ event }) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: just use onClick
            <div
              onClick={() => {
                setOpened(true);
                setCurrentEvent(event);
              }}
              onContextMenu={(e) => {
                setShowContextMenu(true);
                if (event?.id) {
                  setSelectedEvent(event.id);
                }
                // https://stackoverflow.com/questions/6073505/what-is-the-difference-between-screenx-y-clientx-y-and-pagex-y
                setPosition({ x: e.pageX, y: e.pageY });
                e.preventDefault();
              }}
            >
              <div className="bg-calendarBlue rounded-sm p-1">
                {event.title}
              </div>
            </div>
          ),
        }}
      />
      {showContextMenu && (
        <Card
          ref={cardRef}
          style={{
            position: "absolute",
            top: position?.y,
            left: position?.x,
            zIndex: 1000,
          }}
          className="grid grid-rows-2"
        >
          <Button
            variant={"ghost"}
            onClick={() => {
              removeEvent(selectedEvent);
              setChanged(true);
              setShowContextMenu(false);
            }}
          >
            Remove
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => {
              setShowContextMenu(false);
              setShowReschedule(true);
            }}
          >
            Reschedule
          </Button>
        </Card>
      )}
      <PopupDialog
        isOpened={showReschedule}
        setOpened={setShowReschedule}
        title="Reschule event"
        isReschedule={true}
        setChanged={setChanged}
        ref={rescheduleRef}
        id={selectedEvent}
        timeRef={timeRef}
      >
        <Input ref={rescheduleRef} type="date" />
        <Input ref={timeRef} type="time" />
      </PopupDialog>
      <PopupDialog
        isOpened={isOpened}
        setOpened={setOpened}
        title="Selected Event"
      >
        <div className="grid grid-rows-4 items-center justify-center">
          <div>{currentEvent?.title}</div>
          <div>
            Deadline: {getReadableDate(currentEvent?.end)}{" "}
            {currentEvent?.end.toLocaleTimeString()}
          </div>
          <div>Description: {currentEvent?.description}</div>
          <div>Priority: {currentEvent?.priority}</div>
        </div>
      </PopupDialog>
    </>
  );
};

export default DashboardCalendar;
