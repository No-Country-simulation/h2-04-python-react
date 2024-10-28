import { useEffect, useMemo, useState } from "react";
import { DatePicker } from "../components/DatePicker";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import LeagueAccordion from "../components/LeagueAccordion";
import { format, addDays, isSameDay, isAfter } from "date-fns";
import { ArrowUpDown, Clock, ListFilter, Search, Star } from "lucide-react";
import { Input } from "@/common/components/ui/input";
import useAuthStore from "@/api/store/authStore";
import { useTranslation } from "react-i18next";
import useLanguageStore from "@/api/store/language-store";
import BetCoupon from "../components/BetCoupon";
import { useLeagues, useSearchMatches } from "@/api/services/matches";
import { Skeleton } from "@/common/components/ui/skeleton";
import { balon } from "@/common/assets";
import MatchCardWrapper from "../components/MatchCardWrapper";
import { Link } from "react-router-dom";
import { Button } from "@/common/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/common/components/ui/select";

const Matches = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const accessToken = useAuthStore((state) => state.accessToken);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("leagues");
  const { data: searchResults, isLoading: isSearching } =
    useSearchMatches(searchTerm);

  const filterOptions = [
    {
      value: "leagues",
      labelEn: "Leagues",
      labelEs: "Ligas",
      icon: ListFilter,
    },
    {
      value: "trending",
      labelEn: "Trending",
      labelEs: "Tendencia",
      icon: Star,
    },
    {
      value: "schedule",
      labelEn: "Schedule",
      labelEs: "Horario",
      icon: Clock,
    },
  ];

  const [selections, setSelections] = useState(() => {
    const savedSelections = localStorage.getItem("betSelections");
    return savedSelections ? JSON.parse(savedSelections) : [];
  });

  useEffect(() => {
    localStorage.setItem("betSelections", JSON.stringify(selections));
  }, [selections]);

  const { data: leagues, isLoading } = useLeagues(accessToken);

  const sortedLeagues = useMemo(() => {
    if (!leagues) return [];

    switch (filterBy) {
      case "schedule":
        // Por ahora, mantenemos el orden original cuando se selecciona "schedule"
        console.warn("Sorting by schedule is not available yet.");
        return leagues;
      case "trending":
        // Por ahora, mantenemos el orden original cuando se selecciona "trending"
        console.warn("Sorting by trending is not available yet.");
        return leagues;
      default:
        return leagues;
    }
  }, [leagues, filterBy]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const previousDate = addDays(selectedDate, -1);
  const nextDate = addDays(selectedDate, 1);

  const formatDate = (date) => {
    const today = new Date();
    if (isSameDay(date, today)) {
      return currentLanguage === "en" ? "Today" : "Hoy";
    } else {
      return format(date, "d MMM");
    }
  };

  const getActiveTabValue = () => {
    const today = new Date();
    if (
      isSameDay(selectedDate, today) ||
      isSameDay(selectedDate, previousDate)
    ) {
      return selectedDate.toISOString();
    } else if (isAfter(selectedDate, nextDate)) {
      return nextDate.toISOString();
    } else {
      return selectedDate.toISOString();
    }
  };

  const handleOddsSelect = (selection) => {
    setSelections((prevSelections) => {
      const existingIndex = prevSelections.findIndex(
        (s) => s.matchId === selection.matchId
      );
      if (existingIndex !== -1) {
        const updatedSelections = [...prevSelections];
        updatedSelections[existingIndex] = selection;
        return updatedSelections;
      } else {
        return [...prevSelections, selection];
      }
    });
  };

  const removeSelection = (index) => {
    setSelections((prevSelections) =>
      prevSelections.filter((_, i) => i !== index)
    );
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const getErrorMessage = (term) => {
    if (currentLanguage === "en") {
      return `No matches found for '${term}'. Please try searching using the full team name (e.g., Real Madrid)`;
    } else {
      return `No se encontraron partidos para '${term}'. Por favor, intenta buscar por el nombre completo del equipo (ej. Real Madrid)`;
    }
  };

  return (
    <section className="p-2 py-4 mb-28">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1" />
        <h2 className="text-2xl font-bold text-blueWaki  text-center">
          {t("navigation.matches")}
        </h2>
        <div className="flex-1 flex justify-end mr-7">
          <DatePicker date={selectedDate} onDateChange={handleDateChange} />
        </div>
      </div>
      <Tabs value={getActiveTabValue()} className="w-auto">
        <TabsList className="grid w-full grid-cols-3 bg-white">
          <TabsTrigger
            value={previousDate.toISOString()}
            onClick={() => handleDateChange(previousDate)}
          >
            {formatDate(previousDate)}
          </TabsTrigger>
          <TabsTrigger
            value={selectedDate.toISOString()}
            onClick={() => handleDateChange(selectedDate)}
            className="data-[state=active]:shadow-none border-b-2 border-blue-500 rounded-none"
          >
            {formatDate(selectedDate)}
          </TabsTrigger>
          <TabsTrigger
            value={nextDate.toISOString()}
            onClick={() => handleDateChange(nextDate)}
          >
            {formatDate(nextDate)}
          </TabsTrigger>
        </TabsList>

        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            name="search"
            placeholder={
              currentLanguage === "en"
                ? "Search match e.g., Real Madrid, Rivel plate..."
                : "Buscar partido ej: Real Madrid, River Plate..."
            }
            className="pl-12"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {isSearching && (
          <div className="p-4 text-center text-gray-500">
            {currentLanguage === "en" ? "Searching..." : "Buscando..."}
          </div>
        )}

        {!isSearching && searchTerm.length >= 3 && (
          <>
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((match) => (
                <MatchCardWrapper
                  key={match.id_fixture}
                  match={match}
                  onOddsSelect={handleOddsSelect}
                />
              ))
            ) : (
              <div className="p-4 text-sm text-center text-gray-500">
                {getErrorMessage(searchTerm)}
              </div>
            )}
          </>
        )}

        <div className="flex flex-row items-end justify-end pb-3">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-64 max-w-sm border-none shadow-none">
              <div className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4 text-purple-500" />
                <span className="mr-2 text-sm">{t("filter.orderBy")}:</span>
                <span className="text-sm text-[#B1B1B1]">
                  {t(`filter.${filterBy}`)}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={5}>
              {filterOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="flex items-center"
                  disabled={option.value !== "leagues"} // Deshabilitamos la opción de tendencia y horario pq no estan disponible por ahora
                >
                  <div className="flex flex-row items-center space-x-1">
                    <option.icon className="mr-2 h-4 w-4 text-purpleWaki" />
                    <span>
                      {currentLanguage === "en"
                        ? option.labelEn
                        : option.labelEs}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Link to="/profile/my-predictions">
            <Button className="bg-purpleWaki hover:bg-purple-700 text-white leading-10">
              {t("profile.myPredictions")}
            </Button>
          </Link>
        </div>

        <TabsContent value={previousDate.toISOString()}>
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              {t("infoMsg.loadMatch")}
            </div>
          ) : (
            leagues.map((league) => (
              <LeagueAccordion
                key={league.id_league}
                league={league}
                date={format(previousDate, "yyyy-MM-dd")}
                accessToken={accessToken}
                onOddsSelect={handleOddsSelect}
              />
            ))
          )}
        </TabsContent>
        <TabsContent
          value={selectedDate.toISOString()}
          className="waki-shadow rounded-[9px]"
        >
          {isLoading ? (
            <div className="p-4 w-full mx-auto">
              <Skeleton className="h-96 w-full flex flex-col items-center justify-center">
                <img
                  src={balon}
                  alt="Futball"
                  className="size-8 animate-bounce"
                />
                {t("infoMsg.loadLeagues")}
              </Skeleton>
            </div>
          ) : (
            sortedLeagues.map((league) => (
              <LeagueAccordion
                key={league.id_league}
                league={league}
                date={format(selectedDate, "yyyy-MM-dd")}
                accessToken={accessToken}
                onOddsSelect={handleOddsSelect}
              />
            ))
          )}
        </TabsContent>
        <TabsContent value={nextDate.toISOString()}>
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              {t("infoMsg.loadMatch")}
            </div>
          ) : (
            leagues.map((league) => (
              <LeagueAccordion
                key={league.id_league}
                league={league}
                date={format(nextDate, "yyyy-MM-dd")}
                accessToken={accessToken}
                onOddsSelect={handleOddsSelect}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
      <BetCoupon
        selections={selections}
        setSelections={setSelections}
        removeSelection={removeSelection}
      />
    </section>
  );
};

export default Matches;
