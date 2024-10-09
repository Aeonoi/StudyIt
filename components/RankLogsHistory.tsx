// TODO: Separate the different logs based on how the points were gathered (different colors for each type)
import { getRankLogs } from "@/lib/mongo-functions";
import type { IRankLog } from "@/models/ranklog";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { IRank } from "@/models/rank";
import { getRank } from "@/lib/rank";
import { Card } from "./ui/card";

const RankLogsHistory = () => {
  const [rankLogs, setRankLogs] = useState<IRankLog[] | undefined>(undefined);
  const [rank, setRank] = useState<IRank | undefined>(undefined);

  useEffect(() => {
    const fetchRank = async () => {
      setRank(await getRank());
      setRankLogs(await getRankLogs());
    };
    fetchRank();
  }, []);

  return (
    <>
      <div className="flex items-center justify-center">
        <Image
          src={`/ranks/${rank?.rank.toLowerCase()}.png`}
          aria-label={`${rank?.rank}`}
          width={100}
          height={100}
          alt="masters"
        />
        <Card className="p-3">Points: {rank?.points.toFixed(0)}</Card>
      </div>
      <ul className="grid gap-4 shadow overflow-hidden sm:rounded-md">
        {rankLogs?.map((log) => (
          <li key={log._id}>
            <div className="grid grid-cols-12">
              <h3 className="text-lg font-medium text-gray-900 col-span-10">
                {log.points < 0
                  ? `${(log.points).toFixed(0)}`
                  : `+${(log.points).toFixed(0)}`}
              </h3>
              <p>{log.description}</p>
              {/* TODO: display time */}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RankLogsHistory;
