import axios from 'axios';

// Use same-origin path so Next.js rewrites can proxy to backend and avoid CORS
const baseApi = axios.create({
  baseURL: '/api',
});

if (typeof window !== 'undefined') {
  baseApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

if (typeof window !== 'undefined') {
  baseApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');

        window.location.href = '/auth/login';
      }
      return Promise.reject(error);
    }
  );
}

export default baseApi;
