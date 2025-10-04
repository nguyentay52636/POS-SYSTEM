import axios from 'axios';

const baseApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
