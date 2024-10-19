/* eslint-disable react/prop-types */
import useLanguageStore from "@/api/store/language-store";
import { starPoint } from "@/common/assets";
import { Card } from "@/common/components/ui/card";
import { Progress } from "@/common/components/ui/progress";
import { useTranslation } from "react-i18next";
import { getDivisionInfo } from '@/common/utils/division';

const PointsProgressBar = ({ currentPoints }) => {
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
    <Card className="my-6 bg-white rounded-t-[9px] rounded-b-[2px] shadow-md">
      <div className="flex justify-between items-center bg-blueWaki p-5 rounded-t-[9px]">
        <div className="flex flex-row items-center space-x-3">
          <img src={starPoint} alt="Point" className="size-7" />
          <span className="text-lg font-medium text-white">
            {currentLanguage === "en" ? "Your Points" : "Tus Puntos"}
          </span>
        </div>
        <span className="text-2xl font-semibold text-white">
          {currentPoints}
        </span>
      </div>
      <div className="px-5 py-7 flex flex-col gap-5">
        <div className="flex flex-row justify-between gap-x-1 text-sm font-normal mb-1">
          <p className="font-normal text-sm">
            {currentLanguage === "en"
              ? "Unlock division"
              : "Desbloquear división"}
          </p>
          <p className="font-normal text-sm items-end">
            {currentPoints} {currentLanguage === "en" ? "of" : "de"}{" "}
            {pointsNeeded} {currentLanguage === "en" ? "points" : "puntos"}
          </p>
        </div>
        <div className="relative">
          <Progress
            value={progress}
            className="h-11 bg-zinc-200 border-[1.5px] border-purpleWaki rounded-3xl"
            aria-label="Progress Bar"
          />
          <div className="absolute left-0 top-0 h-full flex items-center pl-2">
            <div className="flex flex-row items-center space-x-2 pl-2">
              <img
                src={currentImage}
                alt={`Division ${currentDivision}`}
                className="h-6"
              />
              <span className="text-white text-base font-medium">
                {t(currentDivision)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PointsProgressBar;
