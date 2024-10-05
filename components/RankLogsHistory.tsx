import { getRankLogs } from "@/lib/mongo-functions";
import type { IRankLog } from "@/models/ranklog";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { IRank } from "@/models/rank";
import { getRank } from "@/lib/rank";

const RankLogsHistroy = () => {
  const [rankLogs, setRankLogs] = useState<IRankLog[] | undefined>(undefined);
  const [rank, setRank] = useState<IRank | undefined>(undefined);

  useEffect(() => {
    const fetchRank = async () => {
      setRankLogs(await getRankLogs());
      setRank(await getRank());
    };
    fetchRank();
  }, []);

  return (
    <>
      <div className="flex items-center justify-center">
        <Image
          src={`/${rank?.rank.toLowerCase()}.png`}
          aria-label={`${rank?.rank}`}
          width={100}
          height={100}
          alt="masters"
        />
      </div>
      <ul className="grid gap-4 shadow overflow-hidden sm:rounded-md">
        {rankLogs?.map((log) => (
          <li key={log._id}>
            <div className="grid grid-cols-12">
              <h3 className="text-lg font-medium text-gray-900 col-span-10">
                {log.points < 0 ? `${log.points}` : `+${log.points}`}
              </h3>
              <p>{log.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RankLogsHistroy;
