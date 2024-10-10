"use client";
import ChartLineTotalFocus from "@/components/ChartLineTotalFocus";
import ChartTotalFocus from "@/components/ChartTotalFocus";
import Navbar from "@/components/Navbar";
import NonChartCards from "@/components/NonChartCards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTotalFocusTime } from "@/lib/dashboard";
import { useEffect, useState } from "react";
import DashboardCalendar from "@/components/DashboardCalendar";

export default function Home() {
  useEffect(() => {
    const test = async () => {
      await getTotalFocusTime();
    };
    test();
  });

  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  return (
    <>
      <Navbar />
      <div className="grid grid-rows-2">
        <h1 className="text-3xl">{showCalendar ? "Calendar" : "Overview"}</h1>
        <div className="gap-10 p-10 grid grid-cols-15">
          <Card className="grid grid-cols-2 gap-3 p-1.5">
            <Button onClick={() => setShowCalendar(false)}>Overview</Button>
            <Button onClick={() => setShowCalendar(true)}>Calendar</Button>
          </Card>
        </div>
      </div>
      {showCalendar && <DashboardCalendar />}
      {!showCalendar && (
        <>
          <div className="h-[25vh] ">
            <NonChartCards />
          </div>
          <div className="grid grid-cols-3 items-center justify-center p-8 pb-20 gap-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <ChartTotalFocus />
            <ChartLineTotalFocus />
          </div>
        </>
      )}
    </>
  );
}
