import { useParams, Link } from "react-router-dom";
import { Card } from "@/common/components/ui/card";
import {
  banderin,
  coin,
  goldPrice,
  jersey,
  liga1,
  liga2,
  price1,
  silverPrice,
} from "@/common/assets";
import { ChevronLeft } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/common/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import TableTokensGold from "../components/TableTokensGold";
import TableTokensSilver from "../components/TableTokensSilver";
import { useTranslation } from "react-i18next";

const divisionData = {
  "division-oro": {
    title: "División Oro",
    icon: liga1,
    rewards: [
      {
        icon: price1,
        text: "El usuario en el primer puesto de esta división ganará el premio del mes.",
      },
      {
        icon: goldPrice,
        text: "Participar en el sorteo mensual por el premio de la división Oro.",
      },
      {
        icon: silverPrice,
        text: "Participar en el sorteo mensual por el premio de la división Plata.",
      },
      {
        icon: coin,
        text: "Acceso a los tokens de los jugadores de la división Oro y Plata",
      },
    ],
    monthlyPrize: [
      {
        image: jersey,
        title: "Sorteo división Oro",
        description:
          "Camiseta oficial argentina firmada por tu jugador favorito",
      },
      {
        image: jersey,
        title: "Sorteo división Oro",
        description: "Entradas al partido Argentina vs Venezuela",
      },
    ],
    tokens: [
      {
        table: <TableTokensGold />
      },
      {
        table: <TableTokensSilver />
      }
    ],
  },
  "division-plata": {
    title: "División Plata",
    icon: liga2,
    rewards: [
      {
        icon: silverPrice,
        text: "Participar en el sorteo mensual por el premio de la división Plata.",
      },
      {
        icon: coin,
        text: "Acceso a los tokens de los jugadores de la división Plata",
      },
    ],
    monthlyPrize: [
      {
        image: jersey,
        title: "Sorteo división plata",
        description: "Camiseta selección argentina",
      },
    ],
    tokens: [
      {
        table: <TableTokensSilver />
      }
    ],
  },
};

const DivisionRewards = () => {
  const { leagueType } = useParams();
  const division = divisionData[leagueType];
  const { t } = useTranslation();

  return (
    <>
      <div className="p-4 max-w-md mx-auto">
        <Link to="/divisions" className="flex items-center text-blue-500 mb-4">
          <ChevronLeft className="mr-1" />
          {t('tabs.rewards')}
        </Link>

        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-[22px] font-semibold text-blueWaki">
            {division.title}
          </h1>
          <img
            src={division.icon}
            alt={division.title}
            className="w-20 object-cover"
          />
        </div>
      </div>

      <Card className="w-full bg-[#F7F7F7] border-none rounded-[9px] shadow-divisionCard mt-7 p-5 mb-20">
        <h2 className="text-lg text-[#181818] font-medium mb-4">{t('Rewards')}</h2>
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
                <p className="text-xs ">{reward.text}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg text-[#181818] font-medium my-4">
        {t('MonthlyPrizes')}
        </h2>

        <Carousel
          className="w-full"
          plugins={[
            Autoplay({
              delay: 4000,
              loop: true,
            }),
          ]}
        >
          <CarouselContent className="-ml-4">
            {division.monthlyPrize.map((prize, index) => (
              <CarouselItem
                key={index}
                className={`pl-4 ${
                  prize.length > 1 ? "basis-4/5" : "basis-full"
                }`}
              >
                <Card className="relative bg-gradient-to-r from-blue-500 to-purple-500 text-white h-52">
                  <div className="absolute flex items-center justify-center px-3 pt-4">
                    <img
                      src={prize.image}
                      alt={prize.title}
                      className="w-auto object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{prize.title}</h3>
                      <p className="text-sm text-[#181818]">
                        {prize.description}
                      </p>
                    </div>
                    <div className="absolute -top-[2px] right-6">
                      <div className="relative">
                        <img src={banderin} alt="Banderín" />
                        <img
                          src={
                            division.title === "División Oro"
                              ? goldPrice
                              : silverPrice
                          }
                          alt="Prize"
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-6"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <Carousel
          className="w-full mb-10"
          plugins={[
            Autoplay({
              delay: 4000,
              loop: true,
            }),
          ]}
        >
          <CarouselContent className="p-2 -ml-2">
            {division.tokens.map((token, index) => (
              <CarouselItem
                key={index}
                className="p-2"
              >
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
