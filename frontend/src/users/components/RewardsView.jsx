import PointsProgressBar from "./PointsProgressBar";
import { liga1, liga2, liga3 } from "@/common/assets";
import { Card } from "@/common/components/ui/card";
import LeagueCard from "./LeagueCard";
import useUserDataStore from "@/api/store/userStore";

const getDivisionInfo = (points) => {
  if (points >= 301) {
    return { name: "Oro", image: liga1, nextLevel: null, maxPoints: null };
  } else if (points >= 200) {
    return { name: "Plata", image: liga2, nextLevel: "Oro", maxPoints: 301 };
  } else {
    return { name: "Bronce", image: liga3, nextLevel: "Plata", maxPoints: 200 };
  }
};

const RewardsView = () => {
  const { user } = useUserDataStore();
  const { name: divisionName, image: divisionImage } = getDivisionInfo(
    user.total_points
  );

  return (
    <div className="px-4 py-5">
      <div className="flex flex-col items-center justify-center">
        <img
          src={divisionImage}
          alt="Division 3"
          className="w-20 object-cover"
        />
        <p className="mt-2 text-lg font-medium text-gray-600">Estás en la</p>
        <h3 className="text-[22px] font-bold text-blueWaki">
          División {divisionName}
        </h3>
      </div>
      <PointsProgressBar currentPoints={user.total_points} />

      <Card className="p-4 rounded-[9px] flex flex-col gap-4">
        <h1 className="text-[22px] leading-[33px] font-semibold text-center text-blueWaki">
          ¡Premios todos los meses!
        </h1>

        <LeagueCard type="oro" isCurrentDivision={divisionName === "Oro"} />
        <LeagueCard type="plata" isCurrentDivision={divisionName === "Plata"} />
        <LeagueCard
          type="bronce"
          isCurrentDivision={divisionName === "Bronce"}
        />
      </Card>
    </div>
  );
};

export default RewardsView;
