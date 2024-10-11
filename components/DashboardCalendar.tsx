import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

export interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
}

interface SlotInfo {
  start: Date;
  end: Date;
  slots: Date[];
  action: "select" | "click" | "doubleClick";
}

interface Props {
  eventsList: CalendarEvent[];
}

const localizer = momentLocalizer(moment);

const DashboardCalendar: React.FC<Props> = ({ eventsList }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<
    "month" | "day" | "week" | "work_week" | "agenda"
  >("month");

  // Handler when an event is clicked
  const handleSelectEvent = (event: CalendarEvent) => {
    alert(`Event clicked: ${event.title}`);
  };

  // Handler when a slot is clicked (for adding new events)
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    console.log(slotInfo);
    const start = slotInfo.start;
    const end = slotInfo.end;
    alert(`Selected slot from ${start} to ${end}`);
  };

  // Handler for navigating to the next or previous time period
  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
  };

  const handleViewChange = (
    view: "month" | "day" | "week" | "work_week" | "agenda",
  ) => {
    setCurrentView(view);
  };

  useEffect(() => {
    console.log("In DashboardCalendar");
    console.log(eventsList);
  }, [eventsList]);

  return (
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
      onSelectEvent={handleSelectEvent}
      onSelectSlot={handleSelectSlot}
      views={["month", "week", "day"]} // Allowed views
    />
  );
};

export default DashboardCalendar;
