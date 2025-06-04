import React from 'react';

const PokemonCard = ({ pokemon, onClick }) => {
  const { name, sprite_url, types, rarity } = pokemon;

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return '#FFD700'; // Gold
      case 'epic':
        return '#9370DB'; // MediumPurple
      case 'rare':
        return '#4169E1'; // RoyalBlue
      default:
        return '#808080'; // Gray
    }
  };

  return (
    <div 
      className={`
        bg-white border-2 p-4 transition-transform duration-200 
        ${onClick ? 'cursor-pointer hover:-translate-y-1.5' : 'cursor-default'}
        shadow-md rounded-lg
      `}
      onClick={() => onClick?.(pokemon)}
      style={{
        borderColor: getRarityColor(rarity),
        // Mantain the retro border effect manually or find suitable Tailwind equivalents if needed
        // For now, we apply the rarity color as the main border color
      }}
    >
      <div className="flex justify-between items-center mb-2"> {/* card-header */}
        <h3 className="text-base font-bold text-black">{name}</h3>
        {/* Apply retro badge styles with Tailwind */}
        <span 
          className="text-xs px-2 py-1 rounded-full text-white"
          style={{ backgroundColor: getRarityColor(rarity) }}
        >
          {rarity}
        </span>
      </div>
      {/* Adjust image styles with Tailwind */}
      <img src={sprite_url} alt={name} className="mx-auto mb-2" /> {/* pokemon-sprite */}
      {/* Adjust types container and badge styles with Tailwind */}
      <div className="flex flex-wrap justify-center gap-1"> {/* types-container */}
        {types.map((type, index) => (
          <span key={index} className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-800"> {/* type-badge */}
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PokemonCard; 