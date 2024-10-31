import { fetchData } from "@/api/services/fetchData";
import useAuthStore from "@/api/store/authStore";
import { useQuery } from '@tanstack/react-query';

export function useMonthlyRaffle({language, league}) {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ["monthlyRaffle", language, league],
    queryFn: async () => {
      try {
        const data = await fetchData(
          `monthly-raffle/?language=${language}&ligue=${league}`,
          "GET",
          null,
          accessToken
        );

        return data.results[0]?.image ?? null;
      } catch (error) {
        console.error("Error fetching monthly prizes:", error);
        return null;
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}