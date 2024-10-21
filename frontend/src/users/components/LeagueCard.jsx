/* eslint-disable react/prop-types */
import { Card } from "@/common/components/ui/card";
import { ChevronRight } from "lucide-react";
import { liga1, liga2, liga3 } from "@/common/assets";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const leagueData = {
  gold: {
    image: liga1,
    title: "divGold",
    description: "divGoldDescription",
    showChevron: true,
    hasPath: true,
  },
  silver: {
    image: liga2,
    title: "divSilver",
    description: "divSilverDescription",
    showChevron: true,
    hasPath: true,
  },
  bronze: {
    image: liga3,
    title: "divBronze",
    description: "divBronzeDescription",
    showChevron: false,
    hasPath: false,
  },
};

export default function LeagueCard({ type, isCurrentDivision }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const league = leagueData[type.toLowerCase()];

  if (!league) {
    return null;
  }

  const { image, title, description, showChevron, hasPath } = league;

  const handleClick = () => {
    if (hasPath) {
      navigate(`/divisions/division-${type.toLowerCase()}`);
    }
  };

  return (
    <Card
      className={`bg-[#F3F4F5] rounded-[9px] shadow-none border-none flex flex-1 justify-between items-center gap-4 p-4 
        ${hasPath ? "cursor-pointer" : "cursor-default"} 
        ${isCurrentDivision ? "ring-2 ring-blueWaki" : ""}`}
      onClick={handleClick}
      role={hasPath ? "link" : "presentation"}
      tabIndex={hasPath ? 0 : -1}
    >
      <div className="flex items-center gap-4">
        <img src={image} alt={title} className="h-16 object-cover" />
        <div className="flex flex-col gap-1">
          <span className="font-medium">{t(title)}</span>
          <span className="text-sm text-[#555]">{t(description)}</span>
        </div>
      </div>
      {showChevron && <ChevronRight className="size-10 text-blueWaki" />}
    </Card>
  );
}
