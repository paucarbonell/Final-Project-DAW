import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PokemonCard from '../components/cards/PokemonCard';
import { useAuth } from '../contexts/AuthContext';

const Album = () => {
  const { user } = useAuth();

  const { data: userCards, isLoading } = useQuery({
    queryKey: ['userCards'],
    queryFn: async () => {
      const response = await axios.get('/api/user/cards');
      return response.data;
    },
    enabled: !!user // Solo se ejecuta si hay un usuario autenticado
  });

  if (!user) {
    return (
      <div className="home-container">
        <h2>Inicia sesión para ver tu álbum</h2>
      </div>
    );
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="home-container">
      <h2>Mi Álbum de Cartas</h2>
      <div className="pokemon-grid">
        {userCards?.map(card => (
          <PokemonCard key={card.id} pokemon={card} />
        ))}
      </div>
    </div>
  );
};

export default Album;
  