import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./fetchData";
import useAuthStore from "../store/authStore";
import { compareAsc, isAfter, parseISO } from "date-fns";

export const useMatches = (league, date) => {
  const { accessToken, logout } = useAuthStore();

  return useQuery({
    queryKey: ["matches", league.id_league, date],
    queryFn: async () => {
      const response = await fetchData(
        `search-match/?date=${date}&league=${league.id_league}`,
        "GET",
        null,
        accessToken
      );
      return response.data.results;
    },
    onError: (error) => {
      console.error("Error fetching matches:", error);
      if (
        error.message === "Sesión expirada. Por favor inicia sesión nuevamente."
      ) {
        logout();
        throw new Error(
          "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
        );
      } else {
        throw new Error(
          "Hubo un problema al cargar los partidos. Por favor, intenta de nuevo."
        );
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 30, // 30 minutos
  });
};

export const useSearchMatches = (searchTerm) => {
  const { accessToken, logout } = useAuthStore();

  return useQuery({
    queryKey: ['searchMatches', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 3) {
        return [];
      }
      const response = await fetchData(
        `search-match/?teams=${encodeURIComponent(searchTerm)}`,
        'GET',
        null,
        accessToken
      );
      
      const currentDate = new Date();
      
      const upcomingMatches = response.data.results
        .filter(match => {
          const matchDate = parseISO(match.date);
          // Verificar que el partido no esta finalizado
          return isAfter(matchDate, currentDate) && 
                 (match.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  match.away_team.toLowerCase().includes(searchTerm.toLowerCase()));
        })
        .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date))); // ordenar por fecha

      return upcomingMatches;
    },
    onError: (error) => {
      console.error('Error searching matches:', error);
      if (error.message === 'Sesión expirada. Por favor inicia sesión nuevamente.') {
        logout();
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        throw new Error('Hubo un problema al buscar los partidos. Por favor, intenta de nuevo.');
      }
    },
    staleTime: 1000 * 60 * 5, // 5 min
    cacheTime: 1000 * 60 * 30, // 30 min
    enabled: !!searchTerm && searchTerm.length >= 3,
  });
};

const LEAGUES = [
  { country: "Argentina", name: "Liga Profesional Argentina" },
  { country: "Argentina", name: "Primera Nacional" }, 
  { country: "Argentina", name: "Torneo Federal A" }, 
  { country: "Argentina", name: "Primera B" }, 
  { country: "Argentina", name: "Primera C" }, 
  { country: "Brazil", name: "Serie A" }, 
  { country: "Brazil", name: "Serie B" }, 
  { country: "England", name: "Premier League" },
  { country: "France", name: "Ligue 1" },
  { country: "Germany", name: "Bundesliga" },
  { country: "Italy", name: "Serie A" },
  { country: "Spain", name: "La Liga" },
  { country: "Mexico", name: "Liga MX" },
  { country: "World", name: "UEFA Champions League" },
  { country: "World", name: "UEFA Europa League" },
  { country: "Uruguay", name: "Primera División - Clausura" },
  { country: "Uruguay", name: "Segunda División" },
  { country: "Uruguay", name: "Copa Uruguay" },
  { country: "USA", name: "Major League Soccer" },
];

export const useLeagues = (accessToken) => {
  return useQuery({
    queryKey: ["leagues"],
    queryFn: async () => {
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
      return allLeagues;
    },
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};
