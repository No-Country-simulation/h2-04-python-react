import { refreshToken } from './refreshToken';
import useAuthStore from "../store/authStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchData = async (endpoint, method = 'GET', body = null, token = null) => {
  const fetchWithToken = async (accessToken) => {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const options = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(`${BASE_URL}/${endpoint}`, options);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('El token es inválido o expirado');
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Network response was not ok');
    }

    return response.json();
  };

  try {
    return await fetchWithToken(token);
  } catch (error) {
    if (error.message === 'El token es inválido o expirado' && token) {
      try {
        const newToken = await refreshToken();
        return await fetchWithToken(newToken);
      } catch (refreshError) {
        console.error('Error refrescando el token:', refreshError);
        useAuthStore.getState().logout();
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
      }
    }
    throw error;
  }
};