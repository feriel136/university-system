import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3100',
});

// Ajoute le token dans chaque requête si disponible
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // token stocké après login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
