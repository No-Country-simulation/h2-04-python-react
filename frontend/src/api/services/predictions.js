import { useState, useEffect } from "react";
import useUserDataStore from "@/api/store/userStore";
import useAuthStore from "@/api/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./fetchData";

export function usePredictionLimits() {
  const { user } = useUserDataStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [limits, setLimits] = useState({
    dailyLimit: 5,
    consecutiveDaysLimit: 2,
    usedToday: 0,
    usedConsecutiveDays: 0,
  });

  useEffect(() => {
    // Simulamos la respuesta de la API
    const simulateAPIResponse = () => {
      return {
        usedToday: 1, // simulamos que hemos usando 3 predicciones hoy
        usedConsecutiveDays: 1, // Simulamos que hemos usado 1 predicicon de dia consecutivos
      };
    };

    const apiResponse = simulateAPIResponse();
    setLimits({
      dailyLimit: user.type_user === "Premium" ? 10 : 5,
      consecutiveDaysLimit: 2,
      usedToday: apiResponse.usedToday,
      usedConsecutiveDays: apiResponse.usedConsecutiveDays,
    });
  }, [user, accessToken]);

  const canMakePrediction = () => {
    return (
      limits.usedToday < limits.dailyLimit &&
      limits.usedConsecutiveDays < limits.consecutiveDaysLimit
    );
  };

  const incrementUsage = () => {
    setLimits((prev) => ({
      ...prev,
      usedToday: prev.usedToday + 1,
      usedConsecutiveDays: prev.usedConsecutiveDays + 1,
    }));
  };

  return { limits, canMakePrediction, incrementUsage };
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
