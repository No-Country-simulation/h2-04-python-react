import PointsProgressBar from "./PointsProgressBar";
import { liga3 } from "@/common/assets";
import { Card } from "@/common/components/ui/card";
import LeagueCard from "./LeagueCard";

const RewardsView = () => {
  return (
    <div className="px-4 py-5">
      <div className="flex flex-col items-center justify-center">
        <img src={liga3} alt="Division 3" className="w-20 object-cover" />
        <p className="mt-2 text-lg font-medium text-gray-600">Estás en la</p>
        <h3 className="text-[22px] font-bold text-blueWaki">División Bronce</h3>
      </div>
      <PointsProgressBar currentPoints={200} maxPoints={300} level="Plata" />

      <Card className="p-4 rounded-[9px] flex flex-col gap-4">
        <h1 className="text-[22px] leading-[33px] font-semibold text-center text-blueWaki">
          ¡Premios todos los meses!
        </h1>

        <LeagueCard type="oro" />
        <LeagueCard type="plata" />
        <LeagueCard type="bronce" />
      </Card>
    </div>
  );
};

export default RewardsView;
