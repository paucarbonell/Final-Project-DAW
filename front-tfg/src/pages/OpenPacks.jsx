import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import PackCard from '../components/packs/PackCard';
import PokemonCard from '../components/cards/PokemonCard';
import { useAuth } from '../contexts/AuthContext';

const OpenPacks = () => {
  const { user } = useAuth();
  const [openedCards, setOpenedCards] = useState([]);
  const queryClient = useQueryClient();

  const { data: availablePacks, isLoading: packsLoading } = useQuery({
    queryKey: ['availablePacks'],
    queryFn: async () => {
      const response = await axios.get('/api/cards');
      return response.data;
    }
  });

  const openPackMutation = useMutation({
    mutationFn: async (packId) => {
      const response = await axios.post(`/api/cards/${packId}/open`);
      return response.data;
    },
    onSuccess: (data) => {
      setOpenedCards(data);
      // Actualizar la lista de cartas del usuario
      queryClient.invalidateQueries(['userCards']);
    }
  });

  const handleOpenPack = async (pack) => {
    try {
      await openPackMutation.mutateAsync(pack.id);
    } catch (error) {
      console.error('Error al abrir el sobre:', error);
    }
  };

  if (!user) {
    return (
      <div className="home-container">
        <h2>Inicia sesión para abrir sobres</h2>
      </div>
    );
  }

  if (packsLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="home-container">
      <h2>Abrir Sobres</h2>
      <div className="packs-grid">
        {availablePacks?.map(pack => (
          <PackCard 
            key={pack.id} 
            pack={pack} 
            onOpen={handleOpenPack}
          />
        ))}
      </div>

      {openedCards.length > 0 && (
        <div className="opened-cards">
          <h3>Cartas Obtenidas</h3>
          <div className="pokemon-grid">
            {openedCards.map(card => (
              <PokemonCard key={card.id} pokemon={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenPacks;
  