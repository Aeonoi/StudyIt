"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getTotalFocusTime, type TaskFocus } from "@/lib/dashboard";

const chartConfig = {
  value: {
    label: "Total time",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const ChartLineTotalFocus = () => {
  const [chartData, setChartData] = useState<TaskFocus[] | undefined>(
    undefined,
  );

  useEffect(() => {
    const getDatesOfFocuses = async () => {
      const totalTime = await getTotalFocusTime();
      setChartData(totalTime);
    };
    getDatesOfFocuses();
  }, []);

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 8,
              right: 8,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={5}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="value"
              type="linear"
              stroke="hsl(var(--foreground))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total focus time
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartLineTotalFocus;
