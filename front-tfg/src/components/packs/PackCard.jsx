import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { openPack, resetPackCounters } from '../../services/packService';
import PackOpeningAnimation from './PackOpeningAnimation';
import { useUser } from '../../contexts/UserContext';

const PackCard = ({ pack }) => {
  const { user, refetchUser } = useUser();
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);
  const [obtainedCards, setObtainedCards] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [areImagesLoaded, setAreImagesLoaded] = useState(false);

  useEffect(() => {
    if (!user?.last_pack_opened_at) {
      setTimeLeft(''); // Clear timer if user is not logged in or no last_pack_opened_at
      return;
    }

    const updateTimer = () => {
      const lastOpened = new Date(user.last_pack_opened_at);
      const cooldownEnd = new Date(lastOpened.getTime() + 3 * 60 * 60 * 1000); // 3 hours
      const now = new Date();
      
      if (now >= cooldownEnd) {
        setTimeLeft('');
        return;
      }

      const diff = cooldownEnd - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setTimeLeft(formattedTime);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [user?.last_pack_opened_at, user?.canOpenPack]);

  const openPackMutation = useMutation({
    mutationFn: () => openPack(pack.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packs'] });
      setError(null);
      refetchUser();
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Error al abrir el sobre');
    }
  });

  const preloadImages = (urls) => {
    const promises = urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      });
    });
    return Promise.all(promises);
  };

  const resetCountersMutation = useMutation({
    mutationFn: resetPackCounters,
    onSuccess: () => {
      refetchUser();
      setError(null);
    }
  });

  const handleOpenPack = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    openPackMutation.mutate();
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setObtainedCards([]);
    refetchUser();
  };

  if (openPackMutation.isSuccess && !showAnimation && !areImagesLoaded) {
    const cardImageUrls = openPackMutation.data.cards.map(card => card.image_url);
    preloadImages(cardImageUrls)
      .then(() => {
        setAreImagesLoaded(true);
        setShowAnimation(true);
        setObtainedCards(openPackMutation.data.cards);
      })
      .catch(err => {
        console.error("Error preloading images:", err);
        // Fallback: show animation even if images failed to load
        setAreImagesLoaded(true);
        setShowAnimation(true);
        setObtainedCards(openPackMutation.data.cards);
      });
  } else if (openPackMutation.isSuccess && areImagesLoaded && !showAnimation) {
    // This case handles if images were already loaded (e.g., from a previous successful open)
    // and the animation was just waiting for this flag.
    setShowAnimation(true);
    setObtainedCards(openPackMutation.data.cards);
  }

  const canOpenPack = user?.canOpenPack;

  // Base styles for the retro 3D button aesthetic
  const baseButtonClasses = "bg-[#c0c0c0] border-2 text-[#000000] cursor-pointer \
    border-t-[#ffffff] border-r-[#808080] border-b-[#808080] border-l-[#ffffff] \
    hover:border-t-[#808080] hover:border-r-[#ffffff] hover:border-b-[#ffffff] hover:border-l-[#808080] \
    active:border-[#808080] active:border-t-[#ffffff] active:border-l-[#ffffff] active:pt-[5px] active:pr-[7px] active:pb-[3px] active:pl-[9px] \
    focus:outline focus:outline-1 focus:outline-[#000000] focus:outline-offset-[-4px]";

  // Styles for disabled state
  const disabledButtonClasses = "disabled:text-[#808080] disabled:cursor-not-allowed \
    disabled:border-[#808080] disabled:border-t-[#ffffff] disabled:border-l-[#ffffff] disabled:active:pt-1 disabled:active:px-2";

  return (
    <div className="min-h-[180px] flex flex-col justify-center items-center bg-[#c0c0c0] border-2 border-[#808080] border-t-[#ffffff] border-l-[#ffffff] p-4 rounded-lg shadow-lg">
      {showAnimation && areImagesLoaded ? (
        <PackOpeningAnimation 
          cards={obtainedCards} 
          onComplete={handleAnimationComplete}
        />
      ) : openPackMutation.isPending && !areImagesLoaded ? (
        <div className="flex flex-col items-center justify-center h-[180px]">
          <p className="text-black text-lg">Cargando cartas...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full relative">
          {pack.is_special && (
            <div className="absolute top-0 right-0 text-yellow-500 text-2xl">
              ✨
            </div>
          )}
          <div className="text-center pack-text-container">
            <h3 className="text-lg font-bold text-[#000000] pack-text-line">{pack.name}</h3>
            <p className="text-sm text-[#000000] pack-text-line">{pack.description}</p>
            <p className="text-sm text-[#000000] font-bold">
              Precio: {pack.price} monedas
            </p>
          </div>
          <button
            onClick={handleOpenPack}
            disabled={openPackMutation.isPending || !canOpenPack}
            className={`retro-button ${!canOpenPack && user ? 'retro-button-yellow' : ''}`}
          >
            {!user ? 'Inicia sesión para abrir sobres' :
             openPackMutation.isPending ? 'Abriendo...' :
             !canOpenPack ? `Espera ${timeLeft}` :
             'Abrir Sobre'}
          </button>
          {error && error.includes('esperar') && (
            <button
              onClick={() => resetCountersMutation.mutate()}
              disabled={resetCountersMutation.isPending}
              className={`mt-2 px-3 py-1.5 text-sm ${baseButtonClasses} ${resetCountersMutation.isPending ? disabledButtonClasses : ''}`}
            >
              {resetCountersMutation.isPending ? 'Reseteando...' : 'Resetear contadores'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PackCard; 