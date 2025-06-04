import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Si el token expiró o no es válido, limpiar el localStorage y redirigir al login
            localStorage.removeItem('token');
            // Podrías usar history.push o una redirección similar si usas react-router-dom
            // window.location.href = '/login'; // O la ruta de tu página de login
            console.error('Authentication error: Token expired or invalid.');
            // Aquí podrías emitir un evento o actualizar un estado en el contexto de autenticación
            // para que la UI reaccione (ej: mostrar modal de login, redirigir)
        }
        return Promise.reject(error);
    }
);

export default api; 