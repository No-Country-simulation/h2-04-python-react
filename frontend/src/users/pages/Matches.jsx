import { useEffect, useState } from "react";
import { DatePicker } from "../components/DatePicker";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import LeagueAccordion from "../components/LeagueAccordion";
import { format, addDays, isSameDay, isAfter } from "date-fns";
import { LogOut, Search } from "lucide-react";
import { Input } from "@/common/components/ui/input";
import useAuthStore from "@/api/store/authStore";
import { fetchData } from "@/api/services/fetchData";
import { useTranslation } from "react-i18next";
import useLanguageStore from "@/api/store/language-store";
import { useNavigate } from "react-router-dom";

const LEAGUES = [
  { country: "Spain", name: "La Liga" },
  { country: "Argentina", name: "Liga Profesional Argentina" },
  { country: "England", name: "Premier League" },
  { country: "World", name: "UEFA Champions League" },
  { country: "Germany", name: "Bundesliga" },
  { country: "Italy", name: "Serie A" },
  { country: "France", name: "Ligue 1" },
  { country: "World", name: "UEFA Europa League" },
];

const Matches = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = useAuthStore((state) => state.accessToken);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  useEffect(() => {
    const fetchAllLeagues = async () => {
      try {
        const allLeagues = [];
        for (const league of LEAGUES) {
          const response = await fetchData(
            `search-leagues/?country=${encodeURIComponent(
              league.country
            )}&name=${encodeURIComponent(league.name)}`,
            "GET",
            null,
            accessToken
          );
          if (response.data.results.length > 0) {
            allLeagues.push(response.data.results[0]);
          }
        }
        setLeagues(allLeagues);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leagues:", err);
        setLoading(false);
      }
    };

    fetchAllLeagues();
  }, [accessToken]);

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

  return (
    <section className="p-2 py-4 mb-28">
      <div className="flex justify-between items-center mb-4">
        {/* <div className="flex-1"  /> */}
        <button
          id="logout"
          name="logout"
          onClick={handleLogout}
          className="flex-1 cursor-pointer"
        >
          <LogOut className="size-4 text-zinc-400" />
        </button>
        <h1 className="text-2xl font-bold text-blueWaki flex-1 text-center">
          {t("navigation.matches")}
        </h1>
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
            placeholder="Busca un jugador"
            className="pl-12"
            disabled
          />
        </div>

        <TabsContent value={previousDate.toISOString()}>
          {loading ? (
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
              />
            ))
          )}
        </TabsContent>
        <TabsContent
          value={selectedDate.toISOString()}
          className="waki-shadow rounded-[9px]"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              {t("infoMsg.loadMatch")}
            </div>
          ) : (
            leagues.map((league) => (
              <LeagueAccordion
                key={league.id_league}
                league={league}
                date={format(selectedDate, "yyyy-MM-dd")}
                accessToken={accessToken}
              />
            ))
          )}
        </TabsContent>
        <TabsContent value={nextDate.toISOString()}>
          {loading ? (
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
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Matches;
