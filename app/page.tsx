"use client";
import ChartTotalFocus from "@/components/ChartTotalFocus";
import Navbar from "@/components/Navbar";
import NonChartCards from "@/components/NonChartCards";
export default function Home() {
  return (
    <>
      <Navbar />
      <div className="h-[30vh] ">
        <NonChartCards />
      </div>
      <div className="grid grid-cols-3 items-center justify-center p-8 pb-20 gap-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <ChartTotalFocus />
      </div>
    </>
  );
}
