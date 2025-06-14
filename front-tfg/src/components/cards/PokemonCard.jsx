import React from 'react';
import './PokemonCard.css';

const PokemonCard = ({ baseCard, ownedCardDetails, isOwned }) => {
  // Si la carta no es poseída, mostramos un placeholder
  if (!isOwned || !baseCard) {
    return (
      <div className="pokemon-card-placeholder">
        <div className="pokemon-card-placeholder-number">
          #{baseCard?.id || 'N/A'}
        </div>
        {/* Podríamos añadir una silueta o signo de interrogación aquí */}
      </div>
    );
  }

  // Si la carta es poseída, mostramos los detalles
  // Usamos la imagen shiny si ownedCardDetails indica que es shiny, de lo contrario la normal
  const imageUrl = ownedCardDetails?.is_shiny ? baseCard.shiny_image_url : baseCard.image_url;
  const { name, types = [], rarity } = baseCard;

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="pokemon-card">
      <div className="pokemon-card-image-container">
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={name} 
            className="pokemon-card-image"
          />
        )}
      </div>
      <h3 className="pokemon-card-name">{capitalizeFirstLetter(name)}</h3>
      {types && types.length > 0 && (
        <div className="pokemon-card-types">
          {types.map((type, index) => (
            <span 
              key={index}
              className="pokemon-card-type"
            >
              {capitalizeFirstLetter(type)}
            </span>
          ))}
        </div>
      )}
      {rarity && (
        <p className="pokemon-card-rarity">
          <span className={`rarity-${rarity?.toLowerCase() || 'default'}`}>
            {capitalizeFirstLetter(rarity)}
          </span>
        </p>
      )}
      {ownedCardDetails?.quantity > 1 && (
        <div className="pokemon-card-quantity">
          x{ownedCardDetails.quantity}
        </div>
      )}
      {ownedCardDetails?.is_shiny && (
        <div className="pokemon-card-shiny-indicator">✨</div>
      )}
    </div>
  );
};

export default PokemonCard; 