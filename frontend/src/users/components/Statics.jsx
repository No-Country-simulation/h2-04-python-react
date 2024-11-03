/* eslint-disable react/prop-types */
import { Card } from "@/common/components/ui/card";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import useLanguageStore from "@/api/store/language-store";

export default function Statistics({ data }) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const matchData = data?.response || [];

  const getStatValue = (team, statType) => {
    const stat = team.statistics.find((s) => s.type === statType)
    if (!stat) {
      return null
    }

    const value =
      typeof stat.value === "string" ? stat.value : stat?.value?.toString()
    return value ? value.replace("%", "") : null;
  };

  const stats = [
    { label: t("stats.expectedGoals"), type: "expected_goals" },
    { label: t("stats.ballPossession"), type: "Ball Possession" },
    { label: t("stats.totalShots"), type: "Total Shots" },
    { label: t("stats.shotsOnGoal"), type: "Shots on Goal" },
    { label: t("stats.shotsOffGoal"), type: "Shots off Goal" },
    { label: t("stats.blockedShots"), type: "Blocked Shots" },
    { label: t("stats.cornerKicks"), type: "Corner Kicks" },
    { label: t("stats.offsides"), type: "Offsides" },
    {label: t("stats.goalkeeperSaves"), type: "Goalkeeper Saves"},
    { label: t("stats.fouls"), type: "Fouls" },
    { label: t("stats.yellowCards"), type: "Yellow Cards" },
    { label: t("stats.redCards"), type: "Red Cards" },
    { label: t("stats.totalPasses"), type: "Total passes" },
    { label: t("stats.totalCompletes"), type: "Passes accurate" },
  ];

  if (matchData.length < 2) {
    return (
      null
    );
  }

  return (
    <>
      <h2 className="font-medium text-base text-[#181818] leading-6">
        {currentLanguage === "en" ? "Statics" : "Estadísticas"}
      </h2>
      <Card className="w-full max-w-3xl bg-white waki-shadow p-6 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img
              src={matchData[0].team.logo}
              alt={matchData[0].team.name}
              className="w-auto h-8"
            />
          </div>
          <div className="flex items-center gap-3">
            <img
              src={matchData[1].team.logo}
              alt={matchData[1].team.name}
              className="w-auto h-8"
            />
          </div>
        </div>

        <div className="space-y-3">
        {stats.map((stat, index) => {
            const leftValue = getStatValue(matchData[0], stat.type)
            const rightValue = getStatValue(matchData[1], stat.type)
            
            let leftPercentage, rightPercentage

            if (leftValue === null || rightValue === null) {
              leftPercentage = 50
              rightPercentage = 50
            } else {
              const total = parseFloat(leftValue) + parseFloat(rightValue)
              leftPercentage = (parseFloat(leftValue) / total) * 100
              rightPercentage = (parseFloat(rightValue) / total) * 100
            }

            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm text-[#181818]">
                  <span>
                    {leftValue !== null ? leftValue : '-'}
                    {stat.type === "Ball Possession" && leftValue !== null ? "%" : ""}
                  </span>
                  <div className="flex items-center gap-1">
                    {stat.label}
                    {stat.type === "expected_goals" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="w-4 h-4" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-64">
                            <p>{t("infoMsg.expectedGoals")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <span>
                    {rightValue !== null ? rightValue : '-'}
                    {stat.type === "Ball Possession" && rightValue !== null ? "%" : ""}
                  </span>
                </div>
                <div className="flex h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="bg-purpleWaki h-full"
                    style={{ width: `${leftPercentage}%` }}
                  />
                  <div
                    className="bg-blueWaki h-full"
                    style={{ width: `${rightPercentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </>
  );
}
