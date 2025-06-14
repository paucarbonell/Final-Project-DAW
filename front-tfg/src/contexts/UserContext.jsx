import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import api from '../lib/axios';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);

  const { data: userData, refetch: refetchUser } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (!isAuthenticated) {
        return null;
      }
      
      try {
        const response = await api.get('/user');
        // Asegurarnos de que canOpenPack está incluido y es preciso
        const lastOpenedAt = response.data.last_pack_opened_at ? new Date(response.data.last_pack_opened_at) : null;
        const cooldownEnd = lastOpenedAt ? new Date(lastOpenedAt.getTime() + 3 * 60 * 60 * 1000) : null; // 3 hours
        const now = new Date();

        let calculatedCanOpenPack = response.data.can_open_pack ?? true; // Valor por defecto
        
        // Si el backend dice que sí se puede abrir, pero estamos en cooldown según el tiempo
        if (calculatedCanOpenPack && lastOpenedAt && cooldownEnd && now < cooldownEnd) {
          calculatedCanOpenPack = false;
        }

        const userData = {
          ...response.data,
          canOpenPack: calculatedCanOpenPack,
        };
        return userData;
      } catch {
        // Opcional: si hay un error 401, podrías querer desautenticar aquí también
        // if (error.response?.status === 401) {
        //   logout(); // Asumiendo que logout está disponible aquí si lo necesitas
        // }
        setUser(null); // Asegúrate de que el estado del usuario sea nulo si falla la carga
        return null;
      }
    },
    enabled: isAuthenticated,
    // retry: false, // Permitir reintentos para asegurar la actualización de datos
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
    } else if (!isAuthenticated) {
      setUser(null);
    }
  }, [userData, isAuthenticated]);

  const value = {
    user,
    setUser,
    refetchUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 