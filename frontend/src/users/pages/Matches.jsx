import { useEffect, useState } from "react";
import { DatePicker } from "../components/DatePicker";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import LeagueAccordion from "../components/LeagueAccordion";
import { format, addDays, isSameDay, isAfter, subYears } from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/common/components/ui/input";
import useAuthStore from "@/api/store/authStore";
import { fetchData } from "@/api/services/fetchData";

const COUNTRIES = ["Argentina"];

//retrocediendo la fecha 3 años, solo para pruebas
const adjustDateTo2021 = (date) => {
  return subYears(date, 3);
};

const Matches = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [leagues, setLeagues] = useState([]);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchAllLeagues = async () => {
      try {
        const allLeagues = [];
        for (const country of COUNTRIES) {
          const response = await fetchData(`search-leagues/?country=${country}`, 'GET', null, accessToken);
          allLeagues.push(...response.data.results);
        }
        setLeagues(allLeagues);
      } catch (err) {
        console.log(err.message);
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
      return "Hoy";
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
        <div className="flex-1" />
        <h1 className="text-2xl font-bold text-blueWaki flex-1 text-center">
          Partidos
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
          {leagues.map((league) => (
            <LeagueAccordion
            key={league.id_league}
            league={league}
            // date={format(previousDate, 'yyyy-MM-dd')}
            date={format(adjustDateTo2021(previousDate), 'yyyy-MM-dd')}
            accessToken={accessToken}
            />
          ))}
        </TabsContent>
        <TabsContent value={selectedDate.toISOString()} className="waki-shadow rounded-[9px]">
          {leagues.map((league) => (
           <LeagueAccordion
           key={league.id_league}
           league={league}
          //  date={format(selectedDate, 'yyyy-MM-dd')}
           date={format(adjustDateTo2021(selectedDate), 'yyyy-MM-dd')}
           accessToken={accessToken}
         />
          ))}
        </TabsContent>
        <TabsContent value={nextDate.toISOString()}>
          {leagues.map((league) => (
             <LeagueAccordion
             key={league.id_league}
             league={league}
            //  date={format(nextDate, 'yyyy-MM-dd')}
             date={format(adjustDateTo2021(nextDate), 'yyyy-MM-dd')}
             accessToken={accessToken}
           />
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Matches;
