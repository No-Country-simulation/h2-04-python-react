import useAuthStore from "../store/authStore";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const refreshToken = async () => {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) {
    throw new Error("No hay refresh token disponible");
  }

  try {
    const response = await fetch(`${BASE_URL}/user/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al refrescar el token");
    }

    const data = await response.json();
    useAuthStore.getState().login(data.access, refreshToken);
    return data.access;
  } catch (error) {
    console.error("Error al refrescar el token:", error);
    useAuthStore.getState().logout();
    throw error;
  }
};