import axios from 'axios';

// This acts as the bridge connecting React to your Laravel Nginx webserver
const api = axios.create({
  baseURL: 'http://localhost/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// This interceptor automatically attaches your Sanctum token to future requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;