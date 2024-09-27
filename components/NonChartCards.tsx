import { Card } from "@/components/ui/card";
import {
  averageStudyTime,
  getLoginStreak,
  getTotalLoginDays,
  getTotalStudyingTime,
} from "@/lib/dashboard";
import { useEffect, useState } from "react";
const NonChartCards = () => {
  const [totalLoginDays, setTotalLoginDays] = useState<number | undefined>(0);
  const [avgStudyTime, setAvgStudyTime] = useState<number | undefined>(0);
  const [loginStreak, setLoginStreak] = useState<number | undefined>(0);
  const [totalFocusTime, setTotalFocusTime] = useState<number | undefined>(0);

  useEffect(() => {
    const getData = async () => {
      setTotalLoginDays(await getTotalLoginDays());
      setLoginStreak(await getLoginStreak());
      setTotalFocusTime(await getTotalStudyingTime());
      setAvgStudyTime(await averageStudyTime());
    };
    getData();
  }, []);

  return (
    <div className="grid grid-rows-4">
      <div className="grid grid-cols-4 items-center justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        {/* TODO: Add hovering effects to show more details  */}
        <Card className="p-5">{totalLoginDays}</Card>
        <Card className="p-5">{loginStreak}</Card>
        <Card className="p-5">{totalFocusTime}</Card>
        <Card className="p-5">{avgStudyTime}</Card>
      </div>
    </div>
  );
};

export default NonChartCards;
