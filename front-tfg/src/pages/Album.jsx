import React, { useState, useMemo } from 'react';
import Window from '../components/windows-ui/Window';
import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import PokemonCard from '../components/cards/PokemonCard';
import LoadingWindow from '../components/windows-ui/LoadingWindow';
import { useUser } from '../contexts/UserContext';

const Album = () => {
  const { user } = useUser();
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const isInitialLoading = isAuthenticated && !user;

  const { data: allCardsData, isLoading: isLoadingAllCards, error: allCardsError } = useQuery({
    queryKey: ['allCards'],
    queryFn: async () => {
      const response = await axios.get('/cards');
      return response.data;
    },
    staleTime: Infinity,
  });

  const { data: userCardsData, isLoading: isLoadingUserCards, error: userCardsError } = useQuery({
    queryKey: ['userCards', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const response = await axios.get(`/user/cards`);
      return response.data;
    },
    enabled: !!user,
  });

  const allCards = Array.isArray(allCardsData) ? allCardsData : [];
  const userCards = Array.isArray(userCardsData) ? userCardsData : [];

  const userCardIds = useMemo(
    () => new Set(userCards.map(card => card.pivot.card_id)),
    [userCards]
  );

  const albumSlots = useMemo(() => {
    return allCards.map(card => {
      const isOwned = userCardIds.has(card.id);
      const ownedCardData = userCards.find(uc => uc.pivot.card_id === card.id);
      return {
        ...card,
        isOwned,
        ownedData: ownedCardData,
      };
    });
  }, [allCards, userCardIds, userCards]);

  const totalItems = albumSlots.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlbumPage = albumSlots.slice(startIndex, endIndex);

  const isLoadingContent = isInitialLoading || isLoadingAllCards || isLoadingUserCards;

  if (isInitialLoading) {
    return <LoadingWindow title="Cargando usuario..." />;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-[#000000]">
        <Window
          title="Acceso Restringido"
          className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-4 w-11/12 max-w-md text-center"
        >
          <p>Por favor, inicia sesión para ver tu álbum.</p>
        </Window>
      </div>
    );
  }

  const error = allCardsError || userCardsError;
  const isEmptyOrError = !isLoadingContent && (error || allCards.length === 0);

  if (isEmptyOrError) {
    console.error('Album loading error:', error);
    return (
      <div className="flex justify-center items-center h-screen text-[#0000c0]">
        <Window
          title="Error al cargar Álbum"
          className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-4 w-11/12 max-w-md text-center"
        >
          <p>
            {error
              ? 'Hubo un error al cargar la información del álbum.'
              : 'No se encontraron cartas base para mostrar.'}
          </p>
        </Window>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center pb-5 px-5 w-full box-border">
        <div className="w-[800px] relative mx-auto album-container">
          <Window
            title="Mi Album de Cromos"
            className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-2.5"
          >
            <div className="p-5 bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] album-grid-scroll-area">
              <div className="featured-pokemon-grid gap-6">
                {currentAlbumPage.map(item => (
                  <div key={item.id} className="flex justify-center items-center">
                    {item.isOwned ? (
                      <PokemonCard
                        baseCard={item}
                        ownedCardDetails={item.ownedData}
                        isOwned={true}
                      />
                    ) : (
                      <div className="w-full h-[8.5rem] flex justify-center items-center bg-[#b0b0b0] text-[#606060] text-xl font-bold border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080]">
                        #{item.id}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Window>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center text-[#000000] pagination-container">
          <Window
            title="Navegación"
            className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-2.5"
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoadingContent}
                className="px-4 py-2 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] hover:bg-[#d0d0d0] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff]"
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || isLoadingContent}
                className="px-4 py-2 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] hover:bg-[#d0d0d0] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff]"
              >
                Siguiente
              </button>
            </div>
          </Window>
        </div>
      )}
    </>
  );
};

export default Album;
