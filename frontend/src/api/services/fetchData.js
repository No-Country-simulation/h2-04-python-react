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
        throw new Error('Unauthorized');
      }
      const errorData = await response.json();
      if (response.status === 400) {
        if (endpoint === 'api/token/') {
          throw new Error('Credenciales inválidas');
        }
        throw new Error('El token es inválido o expirado');
      }
      throw new Error(errorData.detail || 'Ocurrió un error en la solicitud');
    }

    return response.json();
  };

  let currentToken = token;

  try {
    return await fetchWithToken(currentToken);
  } catch (error) {
    if (error.message === 'Unauthorized' && currentToken) {
      try {
        const newToken = await refreshToken();
        useAuthStore.getState().setToken(newToken);
        currentToken = newToken;
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