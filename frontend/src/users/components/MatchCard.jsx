/* eslint-disable react/prop-types */
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { format } from "date-fns";
import { Lock, Minus } from "lucide-react";
import useLanguageStore from "@/api/store/language-store";
import { signal } from "@/common/assets";
import { Link } from "react-router-dom";
import { es } from "date-fns/locale";

const createSlug = (homeTeam, awayTeam) => {
  return `${homeTeam.toLowerCase().replace(/\s+/g, "-")}-vs-${awayTeam
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
};

const MatchCard = ({
  leagueName,
  leagueLogo,
  homeTeam,
  awayTeam,
  fixtureDate,
  displayData,
  status,
  onOddsSelect,
  matchId,
}) => {
  const { currentLanguage } = useLanguageStore();
  const date = new Date(fixtureDate);
  const matchDate = format(date, "yyyy-MM-dd");
  const formattedTime = format(date, "HH:mm");
  const formattedDate = format(date, "dd MMM", {
    locale: es,
  });

  const isLive = ["1H", "HT", "2H", "ET", "P", "SUSP", "INT"].includes(
    status?.short
  );
  const isFinished = ["FT", "AET", "PEN"].includes(status?.short);
  const isFinishedOrInProgress = isFinished || isLive;
  const isPostponedOrCancelled = ["PST", "CANC", "ABD"].includes(status?.short);

  const handleOddsClick = (selectedTeam, odds) => {
    onOddsSelect({
      matchId,
      homeTeam: homeTeam.name,
      awayTeam: awayTeam.name,
      homeTeamLogo: homeTeam.logo,
      awayTeamLogo: awayTeam.logo,
      selectedTeam,
      odds,
      matchDate,
    });
  };

  const getStatusText = () => {
    switch (status.short) {
      case "1H":
        return currentLanguage === "en" ? "First Half" : "Primer Tiempo";
      case "HT":
        return currentLanguage === "en" ? "Half-time" : "Entre tiempo";
      case "2H":
        return currentLanguage === "en" ? "Second Half" : "Segundo Tiempo";
      case "ET":
        return currentLanguage === "en" ? "Extra Time" : "Tiempo Extra";
      case "P":
        return currentLanguage === "en" ? "Penalties" : "Penalti";
      case "PST":
        return currentLanguage === "en" ? "Postponed" : "Pospuesto";
      case "SUSP":
        return currentLanguage === "en" ? "Suspended" : "Suspendido";
      case "INT":
        return currentLanguage === "en" ? "Interrupted" : "Interrumpido";
      case "CANC":
        return currentLanguage === "en" ? "Cancellend" : "Cancelado";
      case "ABD":
        return currentLanguage === "en" ? "Abandoned" : "Abandonado";
      case "FT":
        return currentLanguage === "en" ? "Finished" : "Finalizado";
      case "AET":
        return currentLanguage === "en"
          ? "Finished after extra time"
          : "Finalizado en tiempo extra";
      case "PEN":
        return currentLanguage === "en"
          ? "Finished after the penalty shootout"
          : "Finalizado en tanda de penales";
      default:
        return status.short;
    }
  };

  return (
    <Card className="matchCard w-full max-w-sm overflow-hidden rounded-xl bg-[#F3F4F5] shadow-lg my-2">
      <div className="bg-white p-2 flex items-center space-x-2 pl-4">
        <img src={leagueLogo} alt={leagueName} className="w-6 object-cover" />
        <span className="text-gray-700 font-medium">{leagueName}</span>
      </div>
      <div className="p-4 mt-2">
        <div className="flex items-center justify-between mb-4">
          <Link
            to={`/matches/match/${createSlug(
              homeTeam.name,
              awayTeam.name
            )}/${matchId}`}
            className="flex items-center justify-between w-full"
          >
            <div className="flex flex-col items-center space-y-2 flex-1">
              <img
                src={homeTeam.logo}
                alt={homeTeam.name}
                className="w-auto h-10"
              />
              <span className="font-normal text-center">{homeTeam.name}</span>
            </div>
            <div className="flex flex-col items-center justify-center flex-1">
              {isFinishedOrInProgress ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  {isLive && (
                    <div className="flex flex-col justify-center items-center space-y-1">
                      <div className="flex flex-row items-baseline gap-x-1">
                        <div className="size-2 bg-purpleWaki rounded-full animate-pulse" />
                        <img
                          src={signal}
                          alt="Signal icon"
                          width={19}
                          height={21}
                          className="object-cover animate-pulse"
                        />
                      </div>
                      <span className="text-xs font-medium text-green-600">
                        {getStatusText()}
                      </span>
                    </div>
                  )}
                  {!isLive && isFinished && (
                    <span className="text-sm font-normal text-pretty text-center">
                      {getStatusText()}
                    </span>
                  )}
                  <div className="score space-x-2 flex flex-row items-center">
                    <span className="font-semibold text-black text-lg">
                      {displayData.homeTeamGoals}
                    </span>
                    <Minus className="size-4" />
                    <span className="font-semibold text-black text-lg">
                      {displayData.awayTeamGoals}
                    </span>
                  </div>
                </div>
              ) : isPostponedOrCancelled ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <span className="text-sm font-normal text-red-600">
                    {getStatusText()}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-around space-y-2">
                  <span className="text-sm font-medium capitalize">{formattedDate}</span>
                  <span className="text-base font-medium">{formattedTime}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center space-y-2 flex-1">
              <img
                src={awayTeam.logo}
                alt={awayTeam.name}
                className="w-auto h-10"
              />
              <span className="font-normal text-center">{awayTeam.name}</span>
            </div>
          </Link>
        </div>
        <div className="flex justify-around text-sm">
          {!isFinishedOrInProgress &&
            !isPostponedOrCancelled &&
            (displayData.type === "odds" && displayData.value ? (
              displayData.oddsAvailable ? (
                <>
                  <Button
                    className="bg-white hover:bg-gray-200 text-black font-normal text-xs px-5 py-1 leading-[18px]"
                    onClick={() =>
                      handleOddsClick("home", displayData.value.home)
                    }
                  >
                    {(parseFloat(displayData.value.home) * 10).toFixed(2)}
                  </Button>
                  <Button
                    className="bg-white hover:bg-gray-200 text-black font-normal text-xs px-5 py-1 leading-[18px]"
                    onClick={() =>
                      handleOddsClick("draw", displayData.value.draw)
                    }
                  >
                    {(parseFloat(displayData.value.draw) * 10).toFixed(2)}
                  </Button>
                  <Button
                    className="bg-white hover:bg-gray-200 text-black font-normal text-xs px-5 py-1 leading-[18px]"
                    onClick={() =>
                      handleOddsClick("away", displayData.value.away)
                    }
                  >
                    {(parseFloat(displayData.value.away) * 10).toFixed(2)}
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
              )
            ) : null)}
        </div>
      </div>
    </Card>
  );
};

export default MatchCard;