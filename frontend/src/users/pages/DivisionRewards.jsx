import { useParams, Link } from "react-router-dom";
import { Card } from "@/common/components/ui/card";
import {
  coin,
  goldEN,
  goldES,
  goldPrice,
  liga1,
  liga2,
  price1,
  silverEN,
  silverES,
  silverPrice,
} from "@/common/assets";
import { MoveLeft } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/common/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import TableTokensGold from "../components/TableTokensGold";
import TableTokensSilver from "../components/TableTokensSilver";
import { useTranslation } from "react-i18next";
import useLanguageStore from "@/api/store/language-store";
import { useMonthlyRaffle } from "@/common/hooks/useMonthlyRaffle";
import { Skeleton } from "@/common/components/ui/skeleton";
import MonthlyRaffleCarousel from "../components/MonthlyRaffleCarousel";

const DivisionRewards = () => {
  const divisionData = {
    "division-gold": {
      title: "gold",
      icon: liga1,
      rewards: [
        {
          icon: price1,
          textKey: "divRewards.gold.one",
        },
        {
          icon: goldPrice,
          textKey: "divRewards.gold.two",
        },
        {
          icon: silverPrice,
          textKey: "divRewards.gold.three",
        },
        {
          icon: coin,
          textKey: "divRewards.gold.four",
        },
      ],
      monthlyPrize: [
        {
          imageES: goldES,
          imageEN: goldEN,
        },
        {
          imageES: silverES,
          imageEN: silverEN,
        },
      ],
      tokens: [
        {
          table: <TableTokensGold />,
        },
        {
          table: <TableTokensSilver />,
        },
      ],
    },
    "division-silver": {
      title: "silver",
      icon: liga2,
      rewards: [
        {
          icon: silverPrice,
          textKey: "divRewards.silver.one",
        },
        {
          icon: coin,
          textKey: "divRewards.silver.two",
        },
      ],
      monthlyPrize: [
        {
          imageES: silverES,
          imageEN: silverEN,
        },
      ],
      tokens: [
        {
          table: <TableTokensSilver />,
        },
      ],
    },
  };

  const { leagueType } = useParams();
  const division = divisionData[leagueType];
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const leagueMapping = {
    "division-gold": "oro",
    "division-silver": "plata",
  };

  const { data: goldImage, isLoading: isLoadingGold } = useMonthlyRaffle({
    language: currentLanguage.toUpperCase(),
    league: leagueMapping[leagueType],
  });

  const { data: silverImage, isLoading: isLoadingSilver } = useMonthlyRaffle({
    language: currentLanguage.toUpperCase(),
    league: "plata",
  });

  const images =
    leagueType === "division-gold"
      ? [goldImage, silverImage].filter(Boolean)
      : [silverImage].filter(Boolean);
  const slidesPerView = images.length > 1 ? 1.1 : 1;

  return (
    <>
      <div className="p-4 max-w-md mx-auto">
        <Link
          to="/divisions"
          className="flex flex-row items-center gap-x-2 text-blue-500 mb-4"
        >
          <MoveLeft /> {t("tabs.rewards")}
        </Link>

        <div className="flex flex-col items-center justify-center gap-4">
          {currentLanguage === "en" ? (
            <h1 className="text-[22px] font-semibold text-blueWaki">
              {t(division.title)} Division
            </h1>
          ) : (
            <h1 className="text-[22px] font-semibold text-blueWaki">
              Division {t(division.title)}
            </h1>
          )}
          <img
            src={division.icon}
            alt={division.title}
            className="w-20 object-cover"
          />
        </div>
      </div>

      <Card className="w-full bg-[#F7F7F7] border-none rounded-[9px] shadow-divisionCard mt-7 p-5 mb-20">
        <h2 className="text-lg text-[#181818] font-medium mb-4">
          {t("Rewards")}
        </h2>
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {division.rewards.map((reward, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-between p-4 border-b last:border-b-0"
            >
              <div className="flex flex-row items-center justify-between space-x-4">
                <div className="bg-[#F3F4F5] size-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <img
                    src={reward.icon}
                    alt="Reward"
                    className="size-6 object-cover"
                  />
                </div>
                <p className="text-xs">{t(reward.textKey)}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg text-[#181818] font-medium my-4">
          {t("MonthlyPrizes")}
        </h2>

        <div className="max-w-md">
          {isLoadingGold || isLoadingSilver ? (
            <div className="">
              <Skeleton className="w-80 h-44 rounded-lg" />
            </div>
          ) : (
            <MonthlyRaffleCarousel
              images={images}
              slidesPerView={slidesPerView}
            />
          )}
        </div>

        <Carousel
          className="w-full mb-10"
          plugins={[
            Autoplay({
              delay: 10000,
              loop: true,
            }),
          ]}
        >
          <CarouselContent className="p-2 -ml-2">
            {division.tokens.map((token, index) => (
              <CarouselItem key={index} className="p-2">
                {token.table}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Card>
    </>
  );
};

export default DivisionRewards;
