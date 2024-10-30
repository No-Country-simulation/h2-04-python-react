import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./fetchData";
import useAuthStore from "../store/authStore";
import { compareAsc, isAfter, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";

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
    queryKey: ["searchMatches", searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 3) {
        return [];
      }
      const response = await fetchData(
        `search-match/?teams=${encodeURIComponent(searchTerm)}`,
        "GET",
        null,
        accessToken
      );

      const currentDate = new Date();

      const upcomingMatches = response.data.results
        .filter((match) => {
          const matchDate = parseISO(match.date);
          // Verificar que el partido no esta finalizado
          return (
            isAfter(matchDate, currentDate) &&
            (match.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
              match.away_team.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        })
        .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date))); // ordenar por fecha

      return upcomingMatches;
    },
    onError: (error) => {
      console.error("Error searching matches:", error);
      if (
        error.message === "Sesión expirada. Por favor inicia sesión nuevamente."
      ) {
        logout();
        throw new Error(
          "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
        );
      } else {
        throw new Error(
          "Hubo un problema al buscar los partidos. Por favor, intenta de nuevo."
        );
      }
    },
    staleTime: 1000 * 60 * 5, // 5 min
    cacheTime: 1000 * 60 * 30, // 30 min
    enabled: !!searchTerm && searchTerm.length >= 3,
  });
};

export const useLeagues = (accessToken) => {
  const { t, i18n } = useTranslation();

  return useQuery({
    queryKey: ["leagues", i18n.language],
    queryFn: async () => {
      const response = await fetchData(
        `search-leagues/?is_active=true`,
        "GET",
        null,
        accessToken
      );

      if (!response.data || !Array.isArray(response.data.results)) {
        throw new Error('Failed to fetch leagues or invalid data format');
      }

      // Ordenar las ligas alfabéticamente por país traducido
      const sortedLeagues = [...response.data.results].sort((a, b) => {
        const countryA = t(`countries.${a.country}`, { defaultValue: a.country });
        const countryB = t(`countries.${b.country}`, { defaultValue: b.country });
        return countryA.localeCompare(countryB, i18n.language, { sensitivity: 'base' });
      });

      return sortedLeagues;
    },
    staleTime: 1000 * 60 * 60,
  });
};

