/* eslint-disable react/prop-types */
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { format } from "date-fns";
import { Lock, Minus } from "lucide-react";

const MatchCard = ({
  leagueName,
  leagueLogo,
  homeTeam,
  awayTeam,
  fixtureDate,
  displayData,
  status,
}) => {
  const date = new Date(fixtureDate);
  const formattedTime = format(date, "HH:mm");
  const formattedDate = format(date, "dd MMM")
  const isFinished = status.short === "FT";

  return (
    <Card className="matchCard w-full max-w-sm overflow-hidden rounded-xl bg-[#F3F4F5] shadow-lg my-2">
      <div className="bg-white p-2 flex items-center space-x-2 pl-4">
        <img src={leagueLogo} alt={leagueName} className="w-6 object-cover" />
        <span className="text-gray-700 font-medium">{leagueName}</span>
      </div>
      <div className="p-4 mt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-center space-y-2 flex-1">
            <img src={homeTeam.logo} alt={homeTeam.name} className="size-10" />
            <span className="font-normal text-center">{homeTeam.name}</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1">
            {isFinished ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <span className="text-sm font-normal">Finalizado</span>
                <div className="score space-x-2 flex flex-row items-center">
                  <span className="font-semibold text-black text-2xl">
                    {displayData.homeTeamGoals}
                  </span>
                  <Minus className="size-4" />
                  <span className="font-semibold text-black text-2xl">
                    {displayData.awayTeamGoals}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-around space-y-2">
                <span className="text-sm font-medium">{formattedDate}</span>
                <span className="text-base font-medium">{formattedTime}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center space-y-2 flex-1">
            <img src={awayTeam.logo} alt={awayTeam.name} className="size-10" />
            <span className="font-normal text-center">{awayTeam.name}</span>
          </div>
        </div>
        <div className="flex justify-around text-sm">
          {!isFinished &&
            (displayData.type === "odds" && displayData.value ? (
              <>
                <Button className="bg-white hover:bg-gray-200 text-black font-normal text-xs px-5 py-1 leading-[18px]">
                  {displayData.value.home}
                </Button>
                <Button className="bg-white hover:bg-gray-200 text-black font-normal text-xs px-5 py-1 leading-[18px]">
                  {displayData.value.draw}
                </Button>
                <Button className="bg-white hover:bg-gray-200 text-black font-normal text-xs px-5 py-1 leading-[18px]">
                  {displayData.value.away}
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="bg-white hover:bg-gray-200 text-black font-normal text-xs w-20 px-5 py-1 leading-[18px]"
                  disabled
                >
                  <Lock className="size-4" />
                </Button>
                <Button
                  className="bg-white hover:bg-gray-200 text-black font-normal text-xs w-20 px-5 py-1 leading-[18px]"
                  disabled
                >
                  <Lock className="size-4" />
                </Button>
                <Button
                  className="bg-white hover:bg-gray-200 text-black font-normal text-xs w-20 px-5 py-1 leading-[18px]"
                  disabled
                >
                  <Lock className="size-4" />
                </Button>
              </>
            ))}
        </div>
      </div>
    </Card>
  );
};

export default MatchCard;