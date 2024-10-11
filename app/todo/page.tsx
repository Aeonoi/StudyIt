"use client";
import CreateTodo from "@/components/CreateToDo";
import DashboardCalendar, {
  type CalendarEvent,
} from "@/components/DashboardCalendar";
import Navbar from "@/components/Navbar";
import { getCalendarEvents } from "@/lib/todo";
import { useEffect, useState } from "react";

/**
 * Fixes the issue with server-side component passed to the client-side component
 */
const convertEventsToDateObjects = (events: CalendarEvent[]) => {
  return events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));
};

const TodoPage: React.FC = () => {
  const [eventsList, setEventsList] = useState<CalendarEvent[]>([]);
  const [changed, setChanged] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getCalendarEvents();
      const correctEvents = convertEventsToDateObjects(events);
      setEventsList(correctEvents);
    };
    fetchEvents();
    if (changed) {
      setChanged(false);
      fetchEvents();
    }
  }, [changed]);

  return (
    <>
      <Navbar />
      <div className="m-10">
        <CreateTodo setChanged={setChanged} />
      </div>
      <DashboardCalendar eventsList={eventsList} />
    </>
  );
};
export default TodoPage;
