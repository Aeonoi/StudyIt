import { getRankLogs } from "@/lib/mongo-functions";
import type { IRankLog } from "@/models/ranklog";
import { useEffect, useState } from "react";

const RankLogsHistroy = () => {
  const [rankLogs, setRankLogs] = useState<IRankLog[] | undefined>(undefined);

  useEffect(() => {
    const fetchLogs = async () => {
      setRankLogs(await getRankLogs());
    };
    fetchLogs();
  }, []);

  return (
    <>
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
