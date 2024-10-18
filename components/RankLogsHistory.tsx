"use client";
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
import { getReadableDate, getTier, rankPoints } from "@/lib/useful-functions";
import { Progress } from "./ui/progress";

interface FullRank {
  rankName: string;
  fullRank: string; // includes the division/tier
  tier: boolean;
}

const getNextRank = (currentPoints: number): string | undefined => {
  const currentRankTier = getTier(currentPoints, true);
  return currentRankTier;
};

/**
 * @param currentPoints - The current points the user has
 * @param nextRankPoints - The points until the next rank or is undefined for current Mythical rank
 * @returns percetange progress from current rank to next rank
 */
const getProgress = (
  currentPoints: number | undefined,
  nextRankPoints: number | undefined,
): number | undefined => {
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

  const [nextRank, setNextRank] = useState<FullRank | undefined>(undefined);

  useEffect(() => {
    const fetchRank = async () => {
      setRank(await getRank());
      setRankLogs(await getSortedRanks());
    };
    fetchRank();
  }, []);

  useEffect(() => {
    if (rank) {
      const next = getNextRank(rank.points);
      if (next) {
        const fullRank = next.split("-");
        fullRank.length === 1
          ? setNextRank({
              rankName: fullRank[0],
              fullRank: fullRank[0],
              tier: false,
            })
          : setNextRank({ rankName: fullRank[0], fullRank: next, tier: true });
      }
    }
  }, [rank]);

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
          {nextRank !== undefined ? rankPoints.get(nextRank.fullRank) : "..."}
        </Card>
        <Image
          src={`/ranks/${nextRank?.rankName.toLowerCase()}.png`}
          aria-label={`${nextRank}`}
          width={100}
          height={100}
          alt={`${nextRank}`}
        />
      </div>
      <div className="grid items-center justify-items-center">
        <Progress
          value={
            nextRank
              ? getProgress(rank?.points, rankPoints.get(nextRank.fullRank))
              : 0
          }
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
