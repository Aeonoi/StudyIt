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
      <div className="grid justify-items-center">
        <Image
          src={`/ranks/${rank?.rank.toLowerCase()}.png`}
          aria-label={`${rank?.rank}`}
          width={100}
          height={100}
          alt="masters"
        />
        <Card className="p-3">Points: {rank?.points.toFixed(0)}</Card>
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
