import { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios'; // Eliminar esta línea
import api from '../lib/axios'; // Importar la instancia configurada

// Eliminar la configuración global de axios
// axios.defaults.baseURL = 'http://localhost:8000';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado
    const token = localStorage.getItem('token');
    if (token) {
      // La configuración del token ahora se maneja en el interceptor de api
      // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Eliminar esta línea
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/user'); // Usar la instancia api y path corregido
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Usar la instancia api para login con path corregido
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      // La configuración del token ahora se maneja en el interceptor de api
      // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Eliminar esta línea
      setUser(user);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    // Eliminar la cabecera Authorization si se configuró directamente (ya no debería ser necesario)
    // delete axios.defaults.headers.common['Authorization']; // Eliminar esta línea
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 