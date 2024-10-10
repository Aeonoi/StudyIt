import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getCalendarEvents } from "@/lib/todo";

export interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
}

interface SlotInfo {
  start: Date;
  end: Date;
  slots: Date[];
  action: "select" | "click" | "doubleClick"; // Type of action performed
}

const localizer = momentLocalizer(moment);

const DashboardCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<
    "month" | "day" | "week" | "work_week" | "agenda"
  >("month");
  const [eventsList, setEventsList] = useState<CalendarEvent[]>([]);

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
    setCurrentDate(moment.utc(date).toDate());
  };

  const handleViewChange = (
    view: "month" | "day" | "week" | "work_week" | "agenda",
  ) => {
    setCurrentView(view);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getCalendarEvents();
      setEventsList(events);
      console.log(events);
    };
    fetchEvents();
  }, []);
  return (
    <Calendar
      localizer={localizer}
      events={eventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      date={currentDate}
      view={currentView}
      onNavigate={handleNavigate} // Handles next/previous
      onView={handleViewChange} // Handles switching views (month, week, day)
      selectable
      onSelectEvent={handleSelectEvent}
      onSelectSlot={handleSelectSlot}
      views={["month", "week", "day"]} // Allowed views
    />
  );
};

export default DashboardCalendar;
