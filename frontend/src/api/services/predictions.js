import useAuthStore from "@/api/store/authStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "./fetchData";

export const useLimiteDiario = (matchDates) => {
  const { accessToken, logout } = useAuthStore()
  const queryClient = useQueryClient()

  const predictionAvailability = useQuery({
    queryKey: ["predictionAvailability", matchDates],
    queryFn: async () => {
      const promises = matchDates.map(date => 
        fetchData(`predictions/available/?fecha=${date}`, "GET", null, accessToken)
      )
      const responses = await Promise.all(promises)
      return responses.reduce((acc, response) => {
        if (response.status_code !== 200) {
          throw new Error('Failed to fetch prediction availability')
        }
        acc[response.data.fecha] = response.data
        return acc
      }, {})
    },
    onError: (error) => {
      console.error("Error fetching predictions limits:", error)
      if (error.message === "Sesión expirada. Por favor inicia sesión nuevamente.") {
        logout()
        throw new Error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.")
      } else {
        throw new Error("Hubo un problema al cargar las predicciones. Por favor, intenta de nuevo.")
      }
    },
    enabled: !!accessToken && matchDates.length > 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })

  const refreshPredictionAvailability = () => {
    queryClient.invalidateQueries(['predictionAvailability'])
  }

  return { 
    predictionData: predictionAvailability.data,
    isLoading: predictionAvailability.isLoading,
    isError: predictionAvailability.isError,
    error: predictionAvailability.error,
    refreshPredictionAvailability 
  }
}

export const usePredictions = (status) => {
  const { accessToken, logout } = useAuthStore();

  return useQuery({
    queryKey: ["predictions", status],
    queryFn: async () => {
      const endpoint = status
        ? `predictions/?status=${status}`
        : "predictions/";
      const response = await fetchData(endpoint, "GET", null, accessToken);
      return response.data;
    },
    onError: (error) => {
      console.error("Error fetching predictions:", error);
      if (
        error.message === "Sesión expirada. Por favor inicia sesión nuevamente."
      ) {
        logout();
        throw new Error(
          "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
        );
      } else {
        throw new Error(
          "Hubo un problema al cargar las predicciones. Por favor, intenta de nuevo."
        );
      }
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 30, // 30 minutos
  });
};
