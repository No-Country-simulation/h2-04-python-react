/* eslint-disable react/prop-types */
import { starPoint, liga1, liga2, liga3 } from "@/common/assets";
import { Card } from "@/common/components/ui/card";
import { Progress } from "@/common/components/ui/progress";

const getDivisionInfo = (points) => {
  if (points >= 301) {
    return { name: "Oro", image: liga1, nextLevel: null, maxPoints: null };
  } else if (points >= 200) {
    return { name: "Plata", image: liga2, nextLevel: "Oro", maxPoints: 301 };
  } else {
    return { name: "Bronce", image: liga3, nextLevel: "Plata", maxPoints: 200 };
  }
};

const PointsProgressBar = ({ currentPoints }) => {
  const { name: currentDivision, nextLevel, maxPoints, image: currentImage } = getDivisionInfo(currentPoints);
  
  const progress = nextLevel ? (currentPoints / maxPoints) * 100 : 100;
  const pointsNeeded = nextLevel ? maxPoints - currentPoints : 0;


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
        <div className="flex flex-row justify-between gap-x-1 text-sm font-normal mb-1">
          <p className="font-normal text-sm">Desbloquear división</p>
          <p className="font-normal text-sm items-end">
            {currentPoints} de {pointsNeeded} puntos
          </p>
        </div>
        <div className="relative">
          <Progress
            value={progress}
            className="h-11 bg-zinc-200 border-[1.5px] border-purpleWaki rounded-3xl"
          />
          <div className="absolute left-0 top-0 h-full flex items-center pl-2">
            <div className="flex flex-row items-center space-x-2 pl-2">
              <img src={currentImage} alt={`Division ${currentDivision}`} className="h-6" />
              <span className="text-white text-base font-medium">{currentDivision}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PointsProgressBar;