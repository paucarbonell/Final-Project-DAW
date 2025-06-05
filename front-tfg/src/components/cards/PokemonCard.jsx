import React from 'react';
import './PokemonCard.css';

const PokemonCard = ({ pokemon }) => {
  const { name, image_url, types = [], rarity } = pokemon;

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="pokemon-card">
      <div className="pokemon-card-image-container">
        {image_url && (
          <img 
            src={image_url} 
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
    </div>
  );
};

export default PokemonCard; 