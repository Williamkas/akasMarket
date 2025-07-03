import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useLoadingStore } from '@/store/useLoadingStore';

// 🔁 Función para redirigir al login (solo cliente)
const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // ⬅️ Necesario para enviar cookies como refreshToken
});

// 👉 Loading interceptor
api.interceptors.request.use(
  (config) => {
    useLoadingStore.getState().setLoading(true);
    return config;
  },
  (error) => {
    useLoadingStore.getState().setLoading(false);
    return Promise.reject(error);
  }
);

// 👉 Response interceptor con refresh token automático
api.interceptors.response.use(
  (response: AxiosResponse) => {
    useLoadingStore.getState().setLoading(false);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Reintento de refresco de token
        await axios.post('/api/auth/refreshToken', null, {
          withCredentials: true
        });

        // Retry del request original
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);

        // 🚨 Redirigir al login si no se puede refrescar
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    useLoadingStore.getState().setLoading(false);
    return Promise.reject(error);
  }
);

export default api;
