"use client";
import CreateTodo from "@/components/CreateToDo";
import DashboardCalendar, {
  type CustomCalendarEvent,
} from "@/components/DashboardCalendar";
import Navbar from "@/components/Navbar";
import { getCalendarEvents } from "@/lib/todo";
import { useEffect, useState } from "react";

/**
 * Fixes the issue with server-side component passed to the client-side component
 */
const convertEventsToDateObjects = (events: CustomCalendarEvent[]) => {
  return events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));
};

const TodoPage: React.FC = () => {
  const [eventsList, setEventsList] = useState<CustomCalendarEvent[]>([]);
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
      <div className="grid grid-cols-2 m-5">
        <CreateTodo setChanged={setChanged} />
        <DashboardCalendar eventsList={eventsList} setChanged={setChanged} />
      </div>
    </>
  );
};
export default TodoPage;
