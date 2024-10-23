/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from "react";
import { usePredictions } from "@/api/services/predictions";
import { pendingSpin } from "@/common/assets";
import { Card } from "@/common/components/ui/card";
import { Separator } from "@/common/components/ui/separator";
import { TabsContent } from "@/common/components/ui/tabs";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { Calendar } from "@/common/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/common/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import useLanguageStore from "@/api/store/language-store";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/common/components/ui/skeleton";

export default function PredictionsHistory() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const [date, setDate] = useState(Date);

  const { data: pendingPredictions, isLoading: isPendingLoading } =
    usePredictions("pendiente");
  const { data: wonPredictions, isLoading: isWonLoading } =
    usePredictions("ganada");
  const { data: lostPredictions, isLoading: isLostLoading } =
    usePredictions("perdida");

  const isLoading = isPendingLoading || isWonLoading || isLostLoading;

  const sortPredictions = (predictions) => {
    if (!predictions) return [];
    return [...predictions].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  };

  const filterPredictionsByDate = (predictions) => {
    if (!date) return predictions;
    return predictions.filter(
      (prediction) =>
        format(new Date(prediction.created_at), "dd-MM-yyyy") ===
        format(date, "dd-MM-yyyy")
    );
  };

  const sortedPendingPredictions = useMemo(
    () => sortPredictions(pendingPredictions),
    [pendingPredictions]
  );
  const sortedWonPredictions = useMemo(
    () => sortPredictions(wonPredictions),
    [wonPredictions]
  );
  const sortedLostPredictions = useMemo(
    () => sortPredictions(lostPredictions),
    [lostPredictions]
  );

  const filteredPendingPredictions = useMemo(
    () => filterPredictionsByDate(sortedPendingPredictions),
    [sortedPendingPredictions, date]
  );
  const filteredWonPredictions = useMemo(
    () => filterPredictionsByDate(sortedWonPredictions),
    [sortedWonPredictions, date]
  );
  const filteredLostPredictions = useMemo(
    () => filterPredictionsByDate(sortedLostPredictions),
    [sortedLostPredictions, date]
  );

  const hasPendingPredictions = filteredPendingPredictions.length > 0;

  const renderPredictions = (filteredPredictions) => {
    if (filteredPredictions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
          <p className="text-lg text-gray-600">
            {t("prediction.noPredictions")}
          </p>
          <Link to="/matches">
            <Button className="bg-purpleWaki hover:bg-purple-700">
              {t("prediction.makePrediction")}
            </Button>
          </Link>
        </div>
      );
    }

    return filteredPredictions.map((prediction) => (
      <Card
        key={prediction.prediction_id}
        className="waki-shadow rounded-[9px] px-4 py-2 h-fit overflow-hidden"
      >
        <div className="flex flex-col items-start w-full">
          <p className="text-sm capitalize text-purpleWaki">
            {t(`prediction.${prediction.bet_type}`)}
          </p>
          <Separator className="my-2" />
          {prediction.details.map((detail) => (
            <div
              key={detail.id}
              className="my-2 flex flex-col w-full border-b rounded-sm p-1"
            >
              <div className="flex flex-row items-center justify-between">
                <div className="text-sm text-medium flex flex-row items-center mb-1 gap-x-2">
                    <p className="text-xs">{t("prediction.finalResult")}:</p>
                    {detail.prediction_text === "Empate" ? (
                    <p>{t(`prediction.${detail.prediction_text}`)}</p>
                  ) : (
                    <p className="text-sm text-medium">
                      {detail.prediction_text}
                    </p>
                  )}
                  {detail.prediction_text === detail.match.home_team ? (
                    <img
                      src={detail.match.home_team_logo}
                      alt={`${detail.match.home_team} Logo`}
                      className="mr-2 size-5"
                    />
                  ) : detail.prediction_text === detail.match.away_team ? (
                    <img
                      src={detail.match.away_team_logo}
                      alt={`${detail.match.away_team} Logo`}
                      className="mr-2 size-5"
                    />
                  ) : null}

                  
                </div>
                <p className="text-sm text-medium">{detail.selected_odds}</p>
              </div>
              <p className="text-medium text-xs">
                {detail.match.home_team} vs {detail.match.away_team}
              </p>
            </div>
          ))}
          <div className="flex flex-row items-center justify-between w-full">
            <p className="flex text-sm">{t("prediction.points")}:</p>

            <p
              className={`flex text-lg font-medium ${
                prediction.status === "perdida"
                  ? "line-through text-[#555]"
                  : "text-purpleWaki"
              }`}
            >
              {prediction.potential_gain}
            </p>
          </div>
          <p className="text-xs text-[#555] mt-2">
            {currentLanguage === "en" ? "Date:" : "Fecha:"}{" "}
            {new Date(prediction.created_at).toLocaleString()}
          </p>
          <Separator className="my-2" />
          <div className="flex items-center ">
            {prediction.status === "pendiente" && (
              <div className="flex items-center text-purple-600 space-x-1 ">
                <img
                  src={pendingSpin}
                  alt="Pending icon"
                  className="animate-spin"
                />
                <span className="font-normal text-xs text-[#555]">
                  {t("prediction.predictionPending")}
                </span>
              </div>
            )}
            {prediction.status === "ganada" && (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="size-3 mr-1" />
                {currentLanguage === "en" ? (
                  <span className="text-sm">
                    You earned {prediction.potential_gain} points with this
                    prediction
                  </span>
                ) : (
                  <span className="text-sm">
                    Ganaste {prediction.potential_gain} puntos con esta
                    predicción
                  </span>
                )}
              </div>
            )}
            {prediction.status === "perdida" && (
              <div className="flex items-center text-red-600">
                <XCircle className="size-3 mr-1" />
                {currentLanguage === "en" ? (
                  <span className="text-sm">
                    You didn&apos;t earn any points with this prediction
                  </span>
                ) : (
                  <span className="text-sm">
                    No ganaste puntos con esta predicción
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    ));
  };

  return (
    <>
      <TabsContent value="All">
        <Card className="bg-white rounded-t-[9px] rounded-b-none min-h-48 shadow-none border-none p-4 mb-20">
          {isLoading ? (
            <div className="px-4 max-w-md mx-auto space-y-4">
              <Skeleton className="h-9 w-60" />
              <Skeleton className="h-48 w-full mx-auto" />
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className={cn(
                        "flex flex-row gap-2 items-center w-auto justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <p>{t("prediction.filterDate")}</p>

                      {date ? (
                        format(
                          date,
                          currentLanguage === "es"
                            ? "dd/MM, yyyy"
                            : "MMM/dd, yyyy"
                        )
                      ) : (
                        <span>
                          {currentLanguage === "en"
                            ? "Pick a date"
                            : "Selecciona una fecha"}
                        </span>
                      )}
                      <CalendarIcon className="size-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {hasPendingPredictions && (
                <div className="mb-6">
                  <p className="capitalize text-lg text-blueWaki font-medium mb-4">
                    {t("prediction.active")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {renderPredictions(filteredPendingPredictions)}
                  </div>
                </div>
              )}
              <div>
                <p className="capitalize text-lg text-blueWaki font-medium mb-4">
                  {t("prediction.past")}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {renderPredictions([
                    ...filteredWonPredictions,
                    ...filteredLostPredictions,
                  ])}
                </div>
              </div>
            </>
          )}
        </Card>
      </TabsContent>
      <TabsContent value="Win">
        <Card className="bg-white rounded-t-[9px] rounded-b-none min-h-48 shadow-none border-none p-4 mb-20">
          {isLoading ? (
            <div className="px-4 max-w-md mx-auto space-y-4">
              <Skeleton className="h-9 w-60" />
              <Skeleton className="h-48 w-full mx-auto" />
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className={cn(
                        "flex flex-row gap-2 items-center w-auto justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <p>{t("prediction.filterDate")}</p>

                      {date ? (
                        format(
                          date,
                          currentLanguage === "es"
                            ? "dd/MM, yyyy"
                            : "MMM/dd, yyyy"
                        )
                      ) : (
                        <span>
                          {currentLanguage === "en"
                            ? "Pick a date"
                            : "Selecciona una fecha"}
                        </span>
                      )}
                      <CalendarIcon className="size-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {renderPredictions(filteredWonPredictions)}
              </div>
            </>
          )}
        </Card>
      </TabsContent>
      <TabsContent value="Loss">
        <Card className="bg-white rounded-t-[9px] rounded-b-none min-h-48 shadow-none border-none p-4 mb-20">
          {isLoading ? (
            <div className="px-4 max-w-md mx-auto space-y-4">
              <Skeleton className="h-9 w-60" />
              <Skeleton className="h-48 w-full mx-auto" />
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className={cn(
                        "flex flex-row gap-2 items-center w-auto justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <p>{t("prediction.filterDate")}</p>

                      {date ? (
                        format(
                          date,
                          currentLanguage === "es"
                            ? "dd/MM, yyyy"
                            : "MMM/dd, yyyy"
                        )
                      ) : (
                        <span>
                          {currentLanguage === "en"
                            ? "Pick a date"
                            : "Selecciona una fecha"}
                        </span>
                      )}
                      <CalendarIcon className="size-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-5">
                {renderPredictions(filteredLostPredictions)}
              </div>
            </>
          )}
        </Card>
      </TabsContent>
    </>
  );
}