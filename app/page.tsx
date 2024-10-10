"use client";
import ChartLineTotalFocus from "@/components/ChartLineTotalFocus";
import ChartTotalFocus from "@/components/ChartTotalFocus";
import Navbar from "@/components/Navbar";
import NonChartCards from "@/components/NonChartCards";
import { getTotalFocusTime } from "@/lib/dashboard";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const test = async () => {
      await getTotalFocusTime();
    };
    test();
  });

  return (
    <>
      <Navbar />
      <div className="h-[25vh] ">
        <NonChartCards />
      </div>
      <div className="grid grid-cols-3 items-center justify-center p-8 pb-20 gap-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <ChartTotalFocus />
        <ChartLineTotalFocus />
      </div>
    </>
  );
}
