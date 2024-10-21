import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./fetchData";
import useAuthStore from "../store/authStore";

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
