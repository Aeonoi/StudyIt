import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getSortedRanks, type GroupedSortedRanks } from "@/lib/rank";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { IRank } from "@/models/rank";
import { getRank } from "@/lib/rank";
import { Card } from "./ui/card";
import { getReadableDate } from "@/lib/useful-functions";
import { Progress } from "./ui/progress";

const ranks = new Map([
  ["Iron", 1000],
  ["Bronze", 10000],
  ["Gold", 20000],
  ["Gold", 50000],
  ["Platinum", 100000],
  ["Diamond", 200000],
  ["Masters", 1000000],
  ["Mythical", undefined],
]);

const allRanks = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Masters",
  "Mythical",
];

interface RankInfo {
  rank: string;
  points: number | undefined;
}

const getNextRank = (current: string | undefined) => {
  if (!current) {
    return;
  }

  let idx = allRanks.indexOf(current);

  // element exists
  if (idx !== -1) {
    idx = idx !== allRanks.length - 1 ? idx + 1 : allRanks.length - 1;
  }

  const ret: RankInfo = {
    rank: allRanks[idx],
    points: ranks.get(allRanks[idx]),
  };

  return ret;
};

/**
 * @param currentPoints - The current points the user has
 * @param nextRankPoints - The points until the next rank or is undefined for current Mythical rank
 * @returns percetange progress from current rank to next rank
 */
const getProgress = (
  currentPoints: number | undefined,
  nextRankPoints: number | undefined,
) => {
  if (!currentPoints) {
    return;
  }

  // progress = 99 if current rank is the last rank
  if (!nextRankPoints) {
    return 99;
  }

  return (currentPoints / nextRankPoints) * 100;
};

const RankLogsHistory = () => {
  const [rankLogs, setRankLogs] = useState<GroupedSortedRanks[] | undefined>(
    undefined,
  );
  const [rank, setRank] = useState<IRank | undefined>(undefined);

  useEffect(() => {
    const fetchRank = async () => {
      setRank(await getRank());
      setRankLogs(await getSortedRanks());
    };
    fetchRank();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 items-center justify-items-center gap-5">
        <Image
          src={`/ranks/${rank?.rank.toLowerCase()}.png`}
          aria-label={`${rank?.rank}`}
          width={100}
          height={100}
          alt={`${rank?.rank.toLowerCase()}`}
        />
        <Card className="p-3">
          Points: {rank?.points.toFixed(0)}/
          {getNextRank(rank?.rank)?.points !== undefined
            ? getNextRank(rank?.rank)?.points
            : "..."}
        </Card>
        <Image
          src={`/ranks/${getNextRank(rank?.rank)?.rank.toLowerCase()}.png`}
          aria-label={`${rank?.rank}`}
          width={100}
          height={100}
          alt={`${getNextRank(rank?.rank)?.rank.toLowerCase()}`}
        />
      </div>
      <div className="grid items-center justify-items-center">
        <Progress
          value={getProgress(rank?.points, getNextRank(rank?.rank)?.points)}
          className="w-[70%]"
        />
      </div>
      <Accordion type="single" collapsible className="m-10 ">
        {/* view can be days, months, or years  */}
        {rankLogs?.map((view) => (
          <AccordionItem key={view._id} value={view._id}>
            <AccordionTrigger>{view._id}</AccordionTrigger>
            {view.documents.map((log) => {
              if (view._id.split("-").length === 3) {
                return (
                  <AccordionContent
                    key={log._id}
                    className="flex justify-between"
                  >
                    <span className="flex justify-start">
                      {log.points > 0
                        ? `+${log.points.toFixed(0)}`
                        : `${log.points}`}
                    </span>
                    <span className="flex justify-end">{log.description}</span>
                  </AccordionContent>
                );
              }
              return (
                <AccordionContent key={log._id} className="grid grid-rows-2">
                  <p>
                    <span className="flex justify-start">
                      {log.points > 0
                        ? `+${log.points.toFixed(0)}`
                        : `${log.points}`}
                    </span>
                    <span className="flex justify-end">{log.description}</span>
                  </p>
                  <p className="flex justify-end">
                    <span>{getReadableDate(log.time)} </span>
                  </p>
                </AccordionContent>
              );
            })}
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default RankLogsHistory;
