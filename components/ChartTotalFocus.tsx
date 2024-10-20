/**
 * pie chart (left): subjects difference
 * bar chart (middle): hours for each task
 * line chart (right): total time focused
 * line chart (right): days since last done task
 * chart for comparing and seeing the total break times
 */
"use client";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getAllTasks } from "@/lib/dashboard";

import type { TaskFocus } from "@/lib/dashboard";

const chartConfig = {
  value: {
    label: "Total focus ",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const ChartTotalFocus = () => {
  const [chartData, setChartData] = useState<TaskFocus[] | undefined>(
    undefined,
  );

  useEffect(() => {
    const getTasks = async () => {
      const tasks = await getAllTasks();
      setChartData(tasks);
    };
    getTasks();
  }, []);
  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill="hsl(var(--foreground))" radius={5}>
              <LabelList
                position="top"
                offset={10}
                className="fill-foreground"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* TODO: Add some interesting facts about this part */}
        <div className="flex gap-2 font-medium leading-none">
          Total focus time by tasks
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartTotalFocus;
