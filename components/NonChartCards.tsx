import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  averageStudyTime,
  getLoginStreak,
  getTotalLoginDays,
  getTotalStudyingTime,
} from "@/lib/dashboard";
import { useEffect, useState } from "react";
import {
  FlameIcon,
  ClockIcon,
  CalendarIcon,
  HourglassIcon,
} from "lucide-react";
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
    <div className="grid grid-rows-4 h-[100%]">
      <div className="grid grid-cols-4 items-center justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        {/* TODO: Add hovering effects to show more details  */}
        <Card className="p-5">
          <CardContent>
            <CardTitle className="flex">
              Total Login Days <CalendarIcon size={17} />
            </CardTitle>
            {totalLoginDays}
          </CardContent>
        </Card>
        <Card className="p-5">
          <CardContent>
            <CardTitle className="flex">
              Current Streak <FlameIcon size={17} color="#fb7604" />
            </CardTitle>
            {loginStreak}
          </CardContent>
        </Card>
        <Card className="p-5">
          <CardContent>
            <CardTitle className="flex">
              Total Time Focused <ClockIcon size={17} />
            </CardTitle>
            {totalFocusTime} minutes locked in
          </CardContent>
        </Card>
        <Card className="p-5">
          <CardContent>
            <CardTitle className="flex">
              Average Focus Time <HourglassIcon size={16} />
            </CardTitle>
            {avgStudyTime} minutes per focus
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NonChartCards;
