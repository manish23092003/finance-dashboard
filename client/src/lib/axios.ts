import axios from 'axios';
import { useAuthStore } from '../context/authStore';

/**
 * Pre-configured Axios instance for the Finance Dashboard API.
 *
 * Request Interceptor: Attaches `Bearer ${token}` from Zustand store.
 * Response Interceptor: On 401, clears auth state and redirects to /login.
 */
const apiHost = import.meta.env.VITE_API_URL;
const baseURL = apiHost 
  ? (apiHost.startsWith('http') ? `${apiHost}/api` : `https://${apiHost}/api`)
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request: Attach JWT ─────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response: Handle 401 ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
