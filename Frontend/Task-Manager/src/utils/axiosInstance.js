import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
baseURL: BASE_URL,
timeout: 10000,
headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
},
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
(config) => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
},
(error) => {
    return Promise.reject(error);
}
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 👇 Handle expired token
      if (status === 401 && data?.error === 'jwt expired') {
        console.warn('JWT expired. Redirecting to login...');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      // 👇 Handle generic 401
      else if (status === 401) {
        console.warn('Unauthorized. Redirecting to login...');
        window.location.href = '/login';
      }

      // 👇 Handle server errors
      else if (status === 500) {
        console.error('Server error. Please try again later.');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timed out.');
    }

    return Promise.reject(error);
  }
);



export default axiosInstance;
