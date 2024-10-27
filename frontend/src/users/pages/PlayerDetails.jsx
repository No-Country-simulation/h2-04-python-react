import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import { Calendar, MoveLeft } from "lucide-react";
import { Card } from "@/common/components/ui/card";
import { redCard, soccerField, yellowCard } from "@/common/assets";
import { futPlayers } from "../data/footballPlayers";
import { Button } from "@/common/components/ui/button";
import {
  TokenChart,
  TokenDistributionChart,
  YearTokenChart,
} from "../components/TokenChart";
import PlayerNationality from "../components/PlayerNationality";

const PlayerDetails = () => {
  const [activeTab, setActiveTab] = useState("details");
  const { t } = useTranslation();
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const playerId = parseInt(id, 10);

    if (isNaN(playerId)) {
      setError("Invalid player ID");
      return;
    }

    const selectedPlayer = futPlayers.find((p) => p.id === playerId);

    if (selectedPlayer) {
      setPlayer(selectedPlayer);
    } else {
      setError(`No player found with ID ${playerId}`);
    }
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!player) {
    return <div>Loading...</div>;
  }

  return (
    <section className="pb-4 mb-28 items-center">
      <div className="p-2">
        <Link to="/players">
          <div className="p-4 flex flex-row items-center gap-x-2 text-blueWaki text-sm font-normal">
            <MoveLeft /> {t("navigation.scoutPlayers")}
          </div>
        </Link>
        {activeTab === "details" ? (
          <div className="flex flex-col justify-center items-center gap-2.5 px-12 pb-3">
            <img
              src={player.image}
              alt={`${player.name} Photo`}
              width={128}
              height={128}
              className="object-cover size-32 rounded-full aspect-square"
            />

            <h1 className="font-semibold text-xl text-[#181818] leading-8">
              {player.name} {player.lastName}
            </h1>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-2.5 px-12 pb-3">
            <img
              src={player.image}
              alt={`${player.name} Photo`}
              width={80}
              height={80}
              className="object-cover size-20 rounded-full aspect-square"
            />

            <h1 className="font-semibold text-xl text-[#181818] uppercase leading-8">
              {player.lastName}/USDT
            </h1>
            <Button
              type="submit"
              className="w-full max-w-40 bg-purpleWaki hover:bg-purple-700"
              disabled
            >
              Ver todos los tokens
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
        <TabsList className="grid w-full grid-cols-2 bg-transparent">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blueWaki data-[state=active]:rounded-none data-[state=inactive]:text-[#616161] data-[state=inactive]:font-normal data-[state=active]:font-medium data-[state=active]:text-blueWaki"
          >
            Detalles
          </TabsTrigger>
          <TabsTrigger
            value="token"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blueWaki data-[state=active]:rounded-none data-[state=inactive]:text-[#616161] data-[state=inactive]:font-normal data-[state=active]:font-medium data-[state=active]:text-blueWaki"
          >
            Token
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="p-5">
            <h2 className="font-medium text-base text-[#181818] leading-6 mb-2.5">
              Datos del jugador
            </h2>
            <Card className="w-full max-w-md mx-auto bg-white rounded-lg shadow-none waki-shadow border-none overflow-hidden">
              <PlayerNationality nationality={player.nationality} />

              <div className="flex flex-row items-center justify-between px-5 py-2.5 border-b last:border-b-0">
                <div className="flex flex-row items-center justify-between space-x-4">
                  <Calendar
                    strokeWidth={1.5}
                    className="text-purpleWaki h-6 w-auto"
                  />

                  <div className="flex flex-col ">
                    <p className="text-sm text-normal text-[#8d8d8d] ">Edad</p>
                    <p className="text-sm text-normal text-[#181818]">
                      {player.age}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center justify-between px-5 py-2.5 border-b last:border-b-0">
                <div className="flex flex-row items-center justify-between space-x-4">
                  <img
                    src={soccerField}
                    alt="Soccer Field icon"
                    className="w-6 h-auto object-cover"
                  />
                  <div className="flex flex-col ">
                    <p className="text-sm text-normal text-[#8d8d8d]">
                      Posicion
                    </p>
                    <p className="text-sm text-normal text-[#181818]  ">
                      {player.position}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="px-5 flex flex-col gap-y-4">
            <h2 className="font-medium text-base text-[#181818] leading-6">
              Estadísticas
            </h2>

            <div className="grid grid-cols-4 items-center justify-items-center gap-x-1.5">
              <Card className="w-[82px] h-[74px] flex items-center justify-center bg-white rounded-[9px] waki-shadow border-none overflow-hidden">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-normal text-[#8d8d8d]">Goles</p>
                  <p className="text-lg text-medium text-[#181818]">
                    {player.totalGoals}
                  </p>
                </div>
              </Card>

              <Card className="w-[82px] h-[74px] flex items-center justify-center bg-white rounded-[9px] waki-shadow border-none overflow-hidden">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-normal text-[#8d8d8d]">Partidos</p>
                  <p className="text-lg text-medium text-[#181818]">
                    {player.matchesPlayed}
                  </p>
                </div>
              </Card>

              <Card className="w-[82px] h-[74px] flex items-center justify-center bg-white rounded-[9px] waki-shadow border-none overflow-hidden">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-normal text-[#8d8d8d]">Minutos</p>
                  <p className="text-lg text-medium text-[#181818]">
                    {player.minutesPlayed}
                  </p>
                </div>
              </Card>

              <Card className="w-[82px] h-[74px] flex items-center justify-center bg-white rounded-[9px] waki-shadow border-none overflow-hidden">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-normal text-[#8d8d8d]">
                    Asistencia
                  </p>
                  <p className="text-lg text-medium text-[#181818]">
                    {player.assists}
                  </p>
                </div>
              </Card>
            </div>

            <Card className="w-full max-w-md mx-auto bg-white rounded-lg shadow-none waki-shadow border-none overflow-hidden">
              <div className="flex flex-row items-center justify-between p-2.5 border-b last:border-b-0">
                <div className="flex flex-row w-full items-center justify-between">
                  <div className="flex flex-row gap-x-2">
                    <img
                      src={yellowCard}
                      alt="Yellow Card"
                      className="w-auto h-[19px] object-cover"
                    />
                    <p className="text-sm text-normal text-[#181818]">
                      Tarjetas amarillas
                    </p>
                  </div>
                  <p className="text-sm text-normal text-[#181818]">
                    {player.totalYellowCards}
                  </p>
                </div>
              </div>

              <div className="flex flex-row items-center justify-between p-2.5 border-b last:border-b-0">
                <div className="flex flex-row w-full items-center justify-between space-x-4">
                  <div className="flex flex-row gap-x-2">
                    <img
                      src={redCard}
                      alt="Red Card"
                      className="w-auto h-[19px] object-cover"
                    />
                    <p className="text-sm text-normal text-[#181818]">
                      Tarjetas rojas
                    </p>
                  </div>
                  <p className="text-sm text-normal text-[#181818]">
                    {player.totalRedCards}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="px-5 pt-5 flex flex-col gap-y-4">
            <h2 className="font-medium text-base text-[#181818] leading-6">
              Logros
            </h2>

            <Card className="w-full max-w-md mx-auto bg-white rounded-lg shadow-none waki-shadow border-none overflow-hidden">
              {player.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-between px-5 py-2.5 border-b last:border-b-0"
                >
                  <div className="flex flex-row w-full items-center justify-between">
                    <p className="text-sm text-normal text-[#181818]">
                      {achievement}
                    </p>
                    <p className="text-xs text-normal text-[#8d8d8d]">2023</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="token">
          <div className="flex flex-row items-center justify-center gap-4 pt-5">
            <Button
              type="submit"
              className="w-full max-w-40 bg-purpleWaki hover:bg-purple-700"
            >
              Compra
            </Button>
            <Button
              type="submit"
              className="w-full max-w-40 border-2 border-purpleWaki bg-transparent hover:bg-purpleWaki text-purpleWaki hover:text-white"
            >
              Venta
            </Button>
          </div>

          <div className="py-5 px-3 flex flex-col gap-4">
            <div className="">
              <h2 className="font-medium text-base text-[#181818] leading-6 mb-2.5">
                Liberación Acumulada del Token Anual
              </h2>
              <TokenChart lastName={player.lastName} />
            </div>

            <div className="">
              <h2 className="font-medium text-base text-[#181818] leading-6 mb-2.5">
                Liberación de Tokens Anual
              </h2>
              <YearTokenChart lastName={player.lastName} />
            </div>

            <div className="">
              <h2 className="font-medium text-base text-[#181818] leading-6 mb-2.5">
                Tokens Liberados vs. Quemados
              </h2>
              <TokenDistributionChart />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default PlayerDetails;
