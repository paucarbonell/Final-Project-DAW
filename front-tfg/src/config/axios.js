import axios from 'axios';

// Configurar la URL base para todas las peticiones
axios.defaults.baseURL = 'http://localhost:8000';

// Configurar los headers por defecto
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Configurar el interceptor para manejar errores
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Si el token expiró, limpiar el localStorage y redirigir al login
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axios; 