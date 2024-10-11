import useAuthStore from "../store/authStore";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const refreshToken = async (refreshToken) => {
  try {
    const response = await fetch(`${BASE_URL}/user/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Error al refrescar el token");
    }

    const data = await response.json();
    useAuthStore.setState((state) => ({
      ...state,
      accessToken: data.access,
    }));
    return data.access;
  } catch (error) {
    console.error("Error al refrescar el token:", error);
    throw error;
  }
};
