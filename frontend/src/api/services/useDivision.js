import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../store/authStore";
import { fetchData } from "./fetchData";

export const useDivisionThresholds = () => {
    const { accessToken } = useAuthStore();
  
    return useQuery({
      queryKey: ["divisionThresholds"],
      queryFn: async () => {
        const response = await fetchData("division-thresholds/", "GET", null, accessToken);
        return response.divisionThresholds;
      },
      onError: (error) => {
        console.error("Error fetching division data:", error);
        if (
          error.message === "Sesión expirada. Por favor inicia sesión nuevamente."
        ) {
          throw new Error(
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
          );
        } else {
          throw new Error(
            "Hubo un problema al cargar los datos. Por favor, intenta de nuevo."
          );
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 30, // 30 minutos
    });
  };