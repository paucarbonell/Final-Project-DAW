import React from 'react';

const PokemonCard = ({ pokemon }) => {
  const { name, image_url, rarity, type } = pokemon;

  return (
    <div className="pokemon-card">
      <img src={image_url} alt={name} style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
      <h3>{name}</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        <span style={{ 
          padding: '0.25rem 0.5rem', 
          borderRadius: '4px', 
          backgroundColor: type === 'fire' ? '#ff6b6b' : 
                          type === 'water' ? '#4dabf7' : 
                          type === 'grass' ? '#51cf66' : 
                          type === 'electric' ? '#ffd43b' : '#adb5bd',
          color: 'white'
        }}>
          {type}
        </span>
        <span style={{ 
          padding: '0.25rem 0.5rem', 
          borderRadius: '4px', 
          backgroundColor: rarity === 'common' ? '#adb5bd' : 
                          rarity === 'uncommon' ? '#51cf66' : 
                          rarity === 'rare' ? '#4dabf7' : 
                          rarity === 'legendary' ? '#ffd43b' : '#ff6b6b',
          color: 'white'
        }}>
          {rarity}
        </span>
      </div>
    </div>
  );
};

export default PokemonCard; 