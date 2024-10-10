/* eslint-disable react/prop-types */
import { starPoint, liga1, liga2, liga3 } from "@/common/assets";
import { Card } from "@/common/components/ui/card";
import { Progress } from "@/common/components/ui/progress";

const getLevelImage = (level) => {
  const levelMap = {
    Oro: liga1,
    Plata: liga2,
    Bronce: liga3
  };
  return levelMap[level] || liga3;
};

const PointsProgressBar = ({ currentPoints, maxPoints, level }) => {
  const progress = (currentPoints / maxPoints) * 100;
  const levelImage = getLevelImage(level);

  return (
    <Card className="my-6 bg-white rounded-t-[9px] rounded-b-[2px] shadow-md">
      <div className="flex justify-between items-center bg-blueWaki p-5 rounded-t-[9px]">
        <div className="flex flex-row items-center space-x-3">
          <img src={starPoint} alt="Point" className="size-7" />
          <span className="text-lg font-medium text-white">Tus Puntos</span>
        </div>
        <span className="text-2xl font-semibold text-white">
          {currentPoints}
        </span>
      </div>
      <div className="px-5 py-7 flex flex-col gap-5">
        <div className="flex flex-row justify-between text-sm font-normal mb-1">
          <p>Desbloquear división</p>
          <p>
            {currentPoints} de {maxPoints} puntos
          </p>
        </div>
        <div className="relative">
          <Progress
            value={progress}
            className="h-11 bg-[#F3F4F5] border-[1.5px] border-purpleWaki rounded-3xl"
          />
          <div className="absolute left-0 top-0 h-full flex items-center pl-2">
            <div className="flex flex-row items-center space-x-2 pl-2">
              <img src={levelImage} alt={`Division ${level}`} className="h-6" />
              <span className="text-white text-base font-medium">{level}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PointsProgressBar;