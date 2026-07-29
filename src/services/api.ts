import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Get base URL from environment variables
const envBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// In development, if VITE_API_BASE_URL starts with http, we use the local /api proxy to bypass CORS.
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment && envBaseUrl.startsWith('http') ? '/api' : envBaseUrl;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to track the refresh token process status
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

// Process the queue of pending requests that failed with 401
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Add token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // If it's the refresh route, we use the refresh token
    if (config.url === '/auth/refresh') {
      const refreshToken = localStorage.getItem('refreshtoken');
      if (refreshToken && config.headers) {
        config.headers.Authorization = `Bearer ${refreshToken}`;
      }
      return config;
    }

    const accessToken = localStorage.getItem('accesstoken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 token refresh flow
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // Read details
    const responseStatus = error.response?.status;
    const url = originalRequest.url;

    // Avoid infinite loops on login, check week5, and refresh failures
    if (
      responseStatus === 401 &&
      url !== '/auth/login' &&
      url !== '/auth/week5' &&
      url !== '/auth/refresh'
    ) {
      // If we are already refreshing the token, add current request to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // If we don't have a refresh token, we can't refresh
      const refreshToken = localStorage.getItem('refreshtoken');
      if (!refreshToken) {
        localStorage.clear();
        window.dispatchEvent(new Event('auth_logout_redirect'));
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        // Send request to obtain new tokens
        // Note: request interceptor will inject the refreshtoken into headers
        const refreshResponse = await api.post<{
          accesstoken: string;
          refreshtoken: string;
        }>('/auth/refresh');

        const { accesstoken: newAccess, refreshtoken: newRefresh } = refreshResponse.data;

        localStorage.setItem('accesstoken', newAccess);
        localStorage.setItem('refreshtoken', newRefresh);

        // Process the queued up requests
        processQueue(null, newAccess);

        // Retry the original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed -> Log out user and redirect to login
        processQueue(refreshError, null);
        localStorage.clear();
        window.dispatchEvent(new Event('auth_logout_redirect'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (responseStatus === 401 && url === '/auth/refresh') {
      localStorage.clear();
      window.dispatchEvent(new Event('auth_logout_redirect'));
    }

    return Promise.reject(error);
  }
);
