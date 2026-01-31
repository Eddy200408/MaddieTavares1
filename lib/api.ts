import axios from 'axios';

const api = axios.create({
  // URL base do teu back-end
  baseURL: 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // DEBUG: Para vermos se o axios encontrou o token antes de enviar
  console.log("Intercetor Axios - Token encontrado:", token ? "Sim" : "Não");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;