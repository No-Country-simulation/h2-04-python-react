import useAuthStore from "@/api/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./fetchData";

export const useUser = () => {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const endpoint = `user/me/`;
      const response = await fetchData(endpoint, "GET", null, accessToken);
      return response.data;
    },
    onError: (error) => {
      console.error("Error fetching user data:", error);
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
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 30, // 30 minutos
  });
};

