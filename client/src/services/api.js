import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add JWT Auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spoorthi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for global error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected network error occurred';

    // Auto logout if 401 unauthorized
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('spoorthi_token');
      localStorage.removeItem('spoorthi_user');
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
