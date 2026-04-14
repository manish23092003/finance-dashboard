import axios from 'axios';
import { useAuthStore } from '../context/authStore';

/**
 * Pre-configured Axios instance for the Finance Dashboard API.
 *
 * Request Interceptor: Attaches `Bearer ${token}` from Zustand store.
 * Response Interceptor: On 401, clears auth state and redirects to /login.
 *
 * Retry Strategy:
 * Render free-tier servers sleep after ~15min of inactivity. The first request
 * to a cold server can take 30-50s to respond. We retry network errors and
 * timeouts up to 3 times with exponential backoff to absorb the cold-start
 * window transparently, so the user never sees a spurious failure.
 */
const apiHost = import.meta.env.VITE_API_URL;
const baseURL = apiHost 
  ? (apiHost.startsWith('http') ? `${apiHost}/api` : `https://${apiHost}/api`)
  : 'http://localhost:5000/api';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 2000;

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
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

// ── Response: Retry on cold-start failures + Handle 401 ─────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Guard: don't retry if we've exhausted attempts or config is missing
    if (!config || (config.__retryCount ?? 0) >= MAX_RETRIES) {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }

    // Retry only on network errors (server unreachable) or timeouts
    const isNetworkError = !error.response && error.code !== 'ERR_CANCELED';
    const isTimeout = error.code === 'ECONNABORTED';

    if (isNetworkError || isTimeout) {
      config.__retryCount = (config.__retryCount ?? 0) + 1;
      const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, config.__retryCount - 1);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(config);
    }

    // Non-retryable errors (4xx, 5xx with a response)
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
