import React, { useState } from 'react';
import Button from '../windows-ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

const PackCard = ({ pack }) => {
  const { name, description, price, cards_per_pack, image_url } = pack;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);

  const openPackMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/packs/${pack.id}/open`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['userCards', user?.id]);
      console.log('Cartas obtenidas:', data);
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Error al abrir el sobre');
    }
  });

  const handleOpenPack = () => {
    if (!user) {
      setError('Debes iniciar sesión para abrir sobres');
      return;
    }
    setError(null);
    openPackMutation.mutate();
  };

  return (
    <div className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-2.5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#808080] hover:border-t-[#ffffff] hover:border-l-[#ffffff]">
      {image_url && (
        <div className="mb-2 border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-1 bg-white">
          <img src={image_url} alt={name} className="w-full h-32 object-contain" />
        </div>
      )}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-[#000000]">{name}</h3>
        <span className="text-xs text-[#000000]">{price}€</span>
      </div>
      <div className="mb-2">
        <p className="text-xs text-[#000000] mb-1">{description}</p>
        <div className="text-xs text-[#000000]">
          <span>Cartas por sobre: {cards_per_pack}</span>
        </div>
      </div>
      {error && (
        <div className="text-xs text-red-600 mb-2">{error}</div>
      )}
      <Button 
        className="w-full text-xs"
        onClick={handleOpenPack}
        disabled={openPackMutation.isPending}
      >
        {openPackMutation.isPending ? 'Abriendo...' : 'Abrir Sobre'}
      </Button>
    </div>
  );
};

export default PackCard; 