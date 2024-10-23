import useAuthStore from "../store/authStore";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const refreshToken = async () => {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch(`${BASE_URL}/api/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`Error refreshing token: ${data.detail || response.statusText}`);
    }

    const data = await response.json();
    useAuthStore.getState().login(data.access, refreshToken);
    return data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};