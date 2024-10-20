import { refreshToken } from './refreshToken';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchData = async (endpoint, method = 'GET', body = null, accessToken = null) => {
  const fetchWithToken = async (token) => {
    const headers = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(body instanceof FormData) && body !== null) {
      headers['Content-Type'] = 'application/json';
    }

    const options = {
      method,
      headers,
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : null),
    };

    const response = await fetch(`${BASE_URL}/${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ocurrió un error en la solicitud');
    }

    const responseData = await response.json();
    return responseData; 
  };

  try {
    return await fetchWithToken(accessToken);
  } catch (error) {
    if (error.message === 'El token proporcionado no es válido' || error.message === 'El token es inválido o ha caducado') {
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