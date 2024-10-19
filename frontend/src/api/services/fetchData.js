import { refreshToken } from './refreshToken';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchData = async (endpoint, method = 'GET', body = null, accessToken = null) => {
  const fetchWithToken = async (token) => {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(`${BASE_URL}/${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ocurrió un error en la solicitud');
    }

    return response.json();
  };

  try {
    return await fetchWithToken(accessToken);
  } catch (error) {
    if (error.message === 'Given token not valid for any token type' || error.message === 'Token is invalid or expired') {
      try {
        const newToken = await refreshToken();
        return await fetchWithToken(newToken);
      } catch (refreshError) {
        console.error('Error refrescando el token:', refreshError);
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
      }
    }
    throw error;
  }
};