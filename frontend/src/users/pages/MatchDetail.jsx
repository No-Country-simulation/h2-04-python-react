import useLanguageStore from "@/api/store/language-store";
import {
  cardsIcon,
  goalsIcon,
  redCard,
  signal,
  soccerField,
  whistle,
  yellowCard,
} from "@/common/assets";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ListFilter, Minus, MoveLeft } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import { Card } from "@/common/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/common/components/ui/accordion";
import ClassificationDetails from "./ClassificationDetails";
import LatestMatches from "../components/LatestMatches";
import { Skeleton } from "@/common/components/ui/skeleton";
import Statistics from "../components/MatchStatics";

const MatchDetail = () => {
  const { id } = useParams();
  const { currentLanguage } = useLanguageStore();
  const [activeTab, setActiveTab] = useState("details");
  const { t } = useTranslation();

  const fetchMatchDetails = async ({ queryKey }) => {
    const [matchId] = queryKey;
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?id=${matchId}`,
      {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": "3340e6dc57da7cc7c941644d11f7ef1c",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [id],
    queryFn: fetchMatchDetails,
  });

  if (isLoading)
    return (
      <div className="p-4 flex flex-col gap-y-3">
        <Skeleton className="p-2 h-24" />
        <Skeleton className="p-2 h-96" />
        <Skeleton className="p-2 h-24" />
      </div>
    );

  if (error) {
    let errorMessage =
      "Ha ocurrido un error al cargar los detalles del partido.";
    try {
      const parsedError = JSON.parse(error.message);
      if (parsedError.id) {
        errorMessage = `Error: ${parsedError.id}`;
      }
    } catch (error) {
      errorMessage = `Error: ${error.message}`;
    }
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p>{errorMessage}</p>
        <p className="mt-4">
          Por favor, verifica que el ID del partido sea válido e intenta
          nuevamente.
        </p>
      </div>
    );
  }

  const match = data?.response?.[0];
  const leagueId = match?.league?.id;
  const leagueLogo = match?.league?.logo;
  const leagueName = match?.league?.name;
  const homeTeamId = match?.teams?.home.id;
  const awayTeamId = match?.teams?.away.id;

  const formatDate = (date) => {
    if (currentLanguage === "es") {
      const formattedDate = format(date, "dd 'de' MMMM, yyyy. HH:mm aaa", {
        locale: es,
      });
      return formattedDate.replace(/^De /, "de ");
    }
    return format(date, "MMMM dd, yyyy. HH:mm aaa");
  };

  const date = new Date(match.fixture.date);
  const matchDate = formatDate(date);

  const formattedTime = format(date, "HH:mm");
  const formattedDate = format(date, "dd MMM", {
    locale: es,
  });

  const isLive = ["1H", "HT", "2H", "ET", "P", "SUSP", "INT"].includes(
    match?.fixture?.status?.short
  );
  const isFinished = ["FT", "AET", "PEN"].includes(
    match?.fixture?.status?.short
  );
  const isFinishedOrInProgress = isFinished || isLive;
  const isPostponedOrCancelled = ["PST", "CANC", "ABD"].includes(
    match?.fixture?.status?.short
  );

  const events = match?.events || [];
  const goals = events.filter((event) => event.type === "Goal");
  const redCards = events.filter(
    (event) => event.type === "Card" && event.detail === "Red Card"
  );
  const yellowCards = events.filter(
    (event) => event.type === "Card" && event.detail === "Yellow Card"
  );

  const getStatusText = () => {
    switch (match.fixture.status.short) {
      case "1H":
        return currentLanguage === "en" ? "First Half" : "Primer Tiempo";
      case "HT":
        return currentLanguage === "en" ? "Half-time" : "Entre tiempo";
      case "2H":
        return currentLanguage === "en" ? "Second Half" : "Segundo Tiempo";
      case "ET":
        return currentLanguage === "en" ? "Extra Time" : "Tiempo Extra";
      case "P":
        return currentLanguage === "en" ? "Penalties" : "Penalti";
      case "PST":
        return currentLanguage === "en" ? "Postponed" : "Pospuesto";
      case "SUSP":
        return currentLanguage === "en" ? "Suspended" : "Suspendido";
      case "INT":
        return currentLanguage === "en" ? "Interrupted" : "Interrumpido";
      case "CANC":
        return currentLanguage === "en" ? "Cancellend" : "Cancelado";
      case "ABD":
        return currentLanguage === "en" ? "Abandoned" : "Abandonado";
        case "FT":
        return currentLanguage === "en" ? "Finished" : "Finalizado";
      case "AET":
        return currentLanguage === "en"
          ? "Finished after extra time"
          : "Finalizado en tiempo extra";
      case "PEN":
        return currentLanguage === "en"
          ? "Finished after the penalty shootout"
          : "Finalizado en tanda de penales";
      default:
        return match.fixture.status.short;
    }
  };

  if (!match) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">
          No se encontraron detalles del partido
        </h1>
        <p>No se pudo encontrar información para el partido con ID: {id}</p>
        <p className="mt-4">
          Por favor, verifica que el ID del partido sea correcto e intenta
          nuevamente.
        </p>
      </div>
    );
  }

  return (
    <section className="pb-4 mb-28 items-center">
      <div className="p-2">
        <Link to="/matches">
          <div className="p-4 flex flex-row items-center gap-x-2 text-blueWaki text-sm font-normal">
            <MoveLeft /> {t("navigation.matches")}
          </div>
        </Link>
        <div className="flex items-center justify-between gap-x-4 my-4">
          <div className="flex flex-col items-center space-y-2 flex-1">
            <img
              src={match.teams.home.logo}
              alt={match.teams.home.name}
              className="w-auto h-20"
            />
            <span className="font-normal text-xs text-center">
              {match.teams.home.name}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1">
            {isFinishedOrInProgress ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                {isLive && (
                  <div className="flex flex-col justify-center items-center space-y-1">
                    <div className="flex flex-row items-baseline gap-x-1">
                      <div className="size-2 bg-purpleWaki rounded-full animate-pulse" />
                      <img
                        src={signal}
                        alt="Signal icon"
                        width={19}
                        height={21}
                        className="object-cover animate-pulse"
                      />
                    </div>
                    <span className="text-xs font-medium text-green-600">
                      {getStatusText()}
                    </span>
                  </div>
                )}
                {!isLive && isFinished && (
                  <span className="text-sm font-normal text-pretty text-center">{getStatusText()}</span>
                )}
                <div className="score space-x-2 flex flex-row items-center">
                  <span className="font-semibold text-black text-4xl">
                    {match.goals.home}
                  </span>
                  <Minus className="size-4" />
                  <span className="font-semibold text-black text-4xl">
                    {match.goals.away}
                  </span>
                </div>
              </div>
            ) : isPostponedOrCancelled ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <span className="text-sm font-normal text-red-600">
                  {getStatusText()}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-around space-y-2">
                <span className="text-lg font-medium capitalize">{formattedDate}</span>
                <span className="text-4xl font-medium">{formattedTime}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center space-y-2 flex-1">
            <img
              src={match.teams.away.logo}
              alt={match.teams.away.name}
              className="w-auto h-20"
            />
            <span className="font-normal text-xs text-center">
              {match.teams.away.name}
            </span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
        <TabsList className="grid w-full grid-cols-3 bg-transparent">
          <TabsTrigger
            value="predictions"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blueWaki data-[state=active]:rounded-none data-[state=inactive]:text-[#616161] data-[state=inactive]:font-normal data-[state=active]:font-medium data-[state=active]:text-blueWaki"
            disabled
          >
            {t("tabs.predictions")}
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blueWaki data-[state=active]:rounded-none data-[state=inactive]:text-[#616161] data-[state=inactive]:font-normal data-[state=active]:font-medium data-[state=active]:text-blueWaki"
          >
            {t("tabs.details")}
          </TabsTrigger>
          <TabsTrigger
            value="classification"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blueWaki data-[state=active]:rounded-none data-[state=inactive]:text-[#616161] data-[state=inactive]:font-normal data-[state=active]:font-medium data-[state=active]:text-blueWaki"
          >
            {t("tabs.classification")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="p-2 flex flex-col gap-y-4">
            <h2 className="font-medium text-base text-[#181818] leading-6">
              {currentLanguage === "en"
                ? "Match details"
                : "Detalles del partido"}
            </h2>
            <Card className="w-full max-w-md mx-auto bg-white rounded-lg shadow-none waki-shadow border-none overflow-hidden">
              <div className="flex flex-row items-center justify-between px-5 py-2.5 border-b last:border-b-0">
                <div className="flex flex-row items-center justify-between space-x-4">
                  <Calendar
                    strokeWidth={1.5}
                    className="text-purpleWaki h-6 w-auto"
                  />

                  <div className="flex flex-col ">
                    <p className="text-sm text-normal text-[#8d8d8d] ">
                      {currentLanguage === "en"
                        ? "Date and time"
                        : "Fecha y hora"}
                    </p>
                    <p className="text-sm text-normal text-[#181818]">
                      {matchDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center justify-between px-5 py-2.5 border-b last:border-b-0">
                <div className="flex flex-row items-center justify-between space-x-4">
                  <ListFilter
                    strokeWidth={1.5}
                    className="text-purpleWaki h-6 w-auto"
                  />

                  <div className="flex flex-col ">
                    <p className="text-sm text-normal text-[#8d8d8d] ">
                      {currentLanguage === "en" ? "Tournament" : "Torneo"}
                    </p>
                    <p className="text-sm text-normal text-[#181818]">
                      {match.league.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* El endpoint no devuelve esta info */}
              {/* <div className="flex flex-row items-center justify-between px-5 py-2.5 border-b last:border-b-0">
                <div className="flex flex-row items-center justify-between space-x-4">
                  <Trophy
                    strokeWidth={1.5}
                    className="text-purpleWaki h-6 w-auto"
                  />
                  <div className="flex flex-col ">
                    <p className="text-sm text-normal text-[#8d8d8d]">
                      {currentLanguage === "en" ? "Position" : "Copa"}
                    </p>
                    <p className="text-sm text-normal text-[#181818]"></p>
                  </div>
                </div>
              </div> */}

              <div className="flex flex-row items-center justify-between px-5 py-2.5 border-b last:border-b-0">
                <div className="flex flex-row items-center justify-between space-x-4">
                  <img
                    src={soccerField}
                    alt="Soccer Field icon"
                    className="w-6 h-auto object-cover"
                  />
                  <div className="flex flex-col ">
                    <p className="text-sm text-normal text-[#8d8d8d]">
                      {currentLanguage === "en" ? "Venue" : "Estadio"}
                    </p>
                    <p className="text-sm text-normal text-[#181818]  ">
                      {match.fixture.venue.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center justify-between px-5 py-2.5 border-b last:border-b-0">
                <div className="flex flex-row items-center justify-between space-x-4">
                  <img
                    src={whistle}
                    alt="whistle icon"
                    className="w-auto h-4 object-cover"
                  />
                  <div className="flex flex-col ">
                    <p className="text-sm text-normal text-[#8d8d8d]">
                      {currentLanguage === "en" ? "Referee" : "Arbitro"}
                    </p>
                    <p className="text-sm text-normal text-[#181818]  ">
                      {match.fixture.referee || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {isFinished && (
              <>
                {/* Momentos claves*/}
                <h2 className="font-medium text-base text-[#181818] leading-6">
                  {currentLanguage === "en"
                    ? "Match details"
                    : "Momentos claves"}
                </h2>

                <Accordion
                  type="single"
                  collapsible
                  className="w-full bg-white rounded-md waki-shadow"
                >
                  <AccordionItem value="goals">
                    <AccordionTrigger className="px-2 hover:bg-gray-100">
                      <div className="flex items-center w-full">
                        <img
                          src={goalsIcon}
                          alt="Football icon"
                          className="w-7 h-7 object-contain mx-2"
                        />
                        <div className="flex flex-row space-x-2 items-center">
                          <span className="text-[#181818] font-semibold"></span>
                          <span className="text-[#555] text-sm">
                            {currentLanguage === "en" ? "Goals" : "Goles"}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0 lg:p-2 bg-[#F3F4F5]">
                      {goals.length > 0 ? (
                        <div className="p-1 grid md:grid-cols-2 md:gap-1 justify-items-center">
                          {goals.map((goal, index) => (
                            <div
                              key={index}
                              className="flex flex-row gap-x-3 items-center justify-center border-b w-full px-4 py-2.5"
                            >
                              <span className="text-[#181818] font-semibold ">
                                {goal.time.elapsed}&apos;
                              </span>
                              <span className="text-[#555] text-sm">
                                {goal.player.name}
                              </span>
                              <span className="text-[#555] text-sm">
                                <img
                                  src={goal.team.logo}
                                  alt={goal.team.name}
                                  className="w-auto h-5 object-cover"
                                />
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-[#555]">
                          {currentLanguage === "en"
                            ? "No goals in this match."
                            : "No hubieron goles en este partido."}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="cards">
                    <AccordionTrigger className="px-2 hover:bg-gray-100">
                      <div className="flex items-center w-full">
                        <img
                          src={cardsIcon}
                          alt="Cards icon"
                          className="w-7 h-7 object-contain mx-2"
                        />
                        <div className="flex flex-row space-x-2 items-center">
                          <span className="text-[#181818] font-semibold"></span>
                          <span className="text-[#555] text-sm">
                            {currentLanguage === "en" ? "Cards" : "Tarjetas"}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0 lg:p-2 bg-[#F3F4F5]">
                      {redCards.length > 0 || yellowCards.length > 0 ? (
                        <div className="p-1 grid md:grid-cols-2 md:gap-1 justify-items-center">
                          {[...redCards, ...yellowCards]
                            .sort((a, b) => a.time.elapsed - b.time.elapsed)
                            .map((card, index) => (
                              <div
                                key={index}
                                className="flex flex-row gap-x-3 items-center border-b w-full px-4 py-2.5"
                              >
                                <img
                                  src={
                                    card.detail === "Red Card"
                                      ? redCard
                                      : yellowCard
                                  }
                                  alt={
                                    card.detail === "Red Card"
                                      ? "Red Card"
                                      : "Yellow Card"
                                  }
                                  className="w-4 h-6 object-contain"
                                />
                                <span className="text-[#181818] font-semibold">
                                  {card.time.elapsed}&apos;
                                </span>
                                <span className="text-[#555] text-sm">
                                  {card.player.name}
                                </span>
                                <span className="text-[#555] text-sm">
                                  <img
                                    src={card.team.logo}
                                    alt={card.team.name}
                                    className="w-auto h-5 object-cover"
                                  />
                                </span>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-[#555]">
                          {currentLanguage === "en"
                            ? "No cards in this match."
                            : "No hubieron tarjetas en este partido."}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Statistics />
              </>
            )}

            <LatestMatches homeTeam={homeTeamId} awayTeam={awayTeamId} />
          </div>
        </TabsContent>

        <TabsContent value="classification">
          {leagueId && (
            <ClassificationDetails
              leagueId={leagueId}
              leagueLogo={leagueLogo}
              leagueName={leagueName}
            />
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default MatchDetail;
