import PointsProgressBar from "./PointsProgressBar";
import { Card } from "@/common/components/ui/card";
import LeagueCard from "./LeagueCard";
import useUserDataStore from "@/api/store/userStore";
import useLanguageStore from "@/api/store/language-store";
import { useTranslation } from "react-i18next";
import { getDivisionInfo } from '@/common/utils/division';

const RewardsView = () => {
  const { user } = useUserDataStore();
  const { currentLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const { name: divisionName, image: divisionImage } = getDivisionInfo(user.total_points);

  return (
    <div className="px-4 py-5">
      <div className="flex flex-col items-center justify-center">
        <img
          src={divisionImage}
          alt="Division 3"
          className="w-20 object-cover"
          width={80}
          height={108}
        />
        <p className="mt-2 text-lg font-medium text-gray-600">
          {currentLanguage === "en"
            ? "You are currently in the"
            : "Estás en la"}
        </p>
        {currentLanguage === "en" ? (
          <h2 className="text-[22px] font-bold text-blueWaki capitalize">
            {t(divisionName)} Division
          </h2>
        ) : (
          <h2 className="text-[22px] font-bold text-blueWaki capitalize">
            Division {t(divisionName)}
          </h2>
        )}
      </div>
      <PointsProgressBar currentPoints={user.total_points} />

      <Card className="p-4 rounded-[9px] flex flex-col gap-4">
        <h1 className="text-[22px] leading-[33px] font-semibold text-center text-blueWaki">
          {currentLanguage === "en" ? "Prizes every month!" : "¡Premios todos los meses!"}
        </h1>

        <LeagueCard type="gold" isCurrentDivision={divisionName === "gold"} />
        <LeagueCard
          type="silver"
          isCurrentDivision={divisionName === "silver"}
        />
        <LeagueCard
          type="bronze"
          isCurrentDivision={divisionName === "bronze"}
        />
      </Card>
    </div>
  );
};

export default RewardsView;
