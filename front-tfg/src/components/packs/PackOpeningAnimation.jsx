import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PackOpeningAnimation = ({ cards, onComplete }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Card currently being animated
  const [revealedCards, setRevealedCards] = useState([]); // Cards already revealed and static
  const [isComplete, setIsComplete] = useState(false);

  // Effect to handle the overall completion of the animation
  useEffect(() => {
    if (currentCardIndex >= cards.length && !isComplete) {
      setIsComplete(true);
      setTimeout(onComplete, 3000); // Adjusted delay for overall completion
    }
  }, [currentCardIndex, cards.length, isComplete, onComplete]);

  // Effect to add the *previous* card to revealedCards when currentCardIndex advances
  useEffect(() => {
    if (currentCardIndex > 0 && currentCardIndex <= cards.length) {
      // Add the card that just finished animating to the revealed list
      setRevealedCards(prev => [...prev, cards[currentCardIndex - 1]]);
    }
  }, [currentCardIndex, cards]);

  // Handler for when the current card's animation finishes
  const handleCardAnimationComplete = () => {
    // Move to the next card
    setCurrentCardIndex(prev => prev + 1);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* Contenedor principal de la animación. Ajustamos el tamaño para que quepa en el PackCard */}
      <div className="w-full flex-grow flex flex-col items-center justify-center p-2">
        {/* Contenedor de cartas reveladas */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {revealedCards.map((card, index) => (
            <motion.div
              key={`${card.id}-${index}-revealed`} // Unique key to avoid conflicts
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, type: "spring" }} // Animation duration for revealed cards
              className="relative w-24 h-36 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={card.image_url}
                alt={card.name}
                className="w-full h-full object-contain p-2"
              />
              {card.is_shiny && (
                <div className="absolute inset-0 bg-yellow-400/20 animate-pulse" />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
                {card.name}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Carta actual en revelación */}
        <AnimatePresence mode="wait"> {/* Use mode="wait" to ensure one animation finishes before the next starts */}
          {currentCardIndex < cards.length && (
            <motion.div
              key={cards[currentCardIndex]?.id} // Key for AnimatePresence to track individual cards
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.6 } }} // Exit animation speed
              transition={{ duration: 1.2 }} // Overall entry animation speed
              className="relative w-32 h-44 mx-auto"
              onAnimationComplete={handleCardAnimationComplete} // This will trigger when the outer motion.div's animation completes
            >
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 180 }}
                transition={{ duration: 1.0, delay: 0 }} // Rotation animation speed
                className="w-full h-full"
              >
                <motion.div
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 1.0, delay: 0 }} // Rotation animation speed
                  className="absolute inset-0 bg-white rounded-lg shadow-xl overflow-hidden"
                >
                  <img
                    src={cards[currentCardIndex]?.image_url}
                    alt={cards[currentCardIndex]?.name}
                    className="w-full h-full object-contain p-4"
                  />
                  {cards[currentCardIndex]?.is_shiny && (
                    <div className="absolute inset-0 bg-yellow-400/20 animate-pulse" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm p-2 text-center">
                    {cards[currentCardIndex]?.name}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mensaje de completado */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-4"
          >
            <h2 className="text-xl font-bold text-black mb-2">¡Sobre abierto con exito!</h2>
            <p className="text-black/80">Has obtenido {cards.length} cartas nuevas</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PackOpeningAnimation; 