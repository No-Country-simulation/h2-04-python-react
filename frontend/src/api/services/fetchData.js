import { t } from 'i18next';
import useAuthStore from '../store/authStore';
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
      if (response.status === 401) {
          throw new Error('Unauthorized');
      } else if (response.status === 500) {
          throw new Error(t("infoMsg.error500"));
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || t("infoMsg.requestError"));
  }

    return await response.json();
  };

  try {
    return await fetchWithToken(accessToken);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      try {
        const newToken = await refreshToken();
        useAuthStore.getState().login(newToken, useAuthStore.getState().refreshToken);
        return await fetchWithToken(newToken);
      } catch (refreshError) {
        console.error('Error refrescando el token:', refreshError);
        useAuthStore.getState().logout();
        throw new Error(t("infoMsg.refreshError"));
      }
    }
    throw error;
  }
};