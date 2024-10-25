/* eslint-disable react/prop-types */
import useLanguageStore from "@/api/store/language-store";
import { Card } from "@/common/components/ui/card";
import { ProgressBarQuest } from "@/common/components/ui/progressBar";
import { useTranslation } from "react-i18next";
import { getDivisionInfo } from "@/common/utils/division";

const QuestPointsProgressBar = ({ currentPoints }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const {
    name: currentDivision,
    nextLevel,
    maxPoints,
    image: currentImage,
  } = getDivisionInfo(currentPoints);

  const progress = nextLevel ? (currentPoints / maxPoints) * 100 : 100;
  const pointsNeeded = maxPoints || currentPoints;

  return (
    <Card className="my-6 waki-gradient rounded-[9px] shadow-md">
      <div className="flex flex-col justify-center items-center pt-5 mb-2">
        <div className="flex flex-row items-center space-x-3">
          <span className="text-lg font-medium text-white">
            {currentLanguage === "en" ? "Your Points" : "Tus Puntos"}
          </span>
        </div>
        <span className="text-5xl font-semibold text-white">
          {currentPoints}
        </span>
      </div>
      <div className="px-5 pb-7 flex flex-col gap-2">
        <p className="font-normal text-base text-white items-end">
          {currentPoints} {currentLanguage === "en" ? "of" : "de"}{" "}
          {pointsNeeded} {currentLanguage === "en" ? "points" : "puntos"}
        </p>

        <div className="relative">
          <ProgressBarQuest
            value={progress}
            className="h-11 bg-zinc-300 border-[1.5px] border-white rounded-3xl"
            aria-label="Progress Bar"
          />
          <div className="absolute left-0 top-0 h-full flex items-center pl-2">
            <div className="flex flex-row items-center space-x-2 pl-2">
              <img
                src={currentImage}
                alt={`Division ${currentDivision}`}
                className="h-6"
              />
              <span className="text-black text-base font-medium">
                {t(currentDivision)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuestPointsProgressBar;
