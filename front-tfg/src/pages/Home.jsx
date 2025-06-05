import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import PokemonCard from '../components/cards/PokemonCard';
import LoadingWindow from '../components/windows-ui/LoadingWindow';
import Window from '../components/windows-ui/Window';
import Button from '../components/windows-ui/Button';

const Home = () => {
  const navigate = useNavigate();
  const [randomPokemon, setRandomPokemon] = useState([]);

  const { data: pokemon, isLoading } = useQuery({
    queryKey: ['cards'],
    queryFn: () => axios.get('/cards').then(res => res.data)
  });

  // Función para obtener 10 Pokémon aleatorios
  const getRandomPokemon = (pokemonList) => {
    if (!pokemonList) return [];
    const shuffled = [...pokemonList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };

  // Actualizar Pokémon aleatorios cada 30 segundos
  useEffect(() => {
    if (pokemon) {
      setRandomPokemon(getRandomPokemon(pokemon));

      const interval = setInterval(() => {
        setRandomPokemon(getRandomPokemon(pokemon));
      }, 30000); // 30 segundos

      return () => clearInterval(interval);
    }
  }, [pokemon]);

  if (isLoading) {
    return <LoadingWindow />;
  }

  return (
    <>
      <div className="flex justify-center pb-5 px-5 w-full box-border">
        <div className="w-[800px] home-sections-container relative mx-auto mb-5">
          <Window 
            title="Bienvenido a Pokemon Card Collection"
            className="welcome-section bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-2.5"
          >
            <div className="text-center welcome-inner-message bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080]">
              <h1 className="text-3xl mb-4 text-[#000080] drop-shadow-[1px_1px_0_#ffffff] font-bold">Coleccion de Cartas Pokemon</h1>
              <p className="welcome-message-text text-lg text-[#000000] mb-4">Colecciona, intercambia y descubre nuevos Pokemon en cada sobre</p>
              <Button 
                className="collect-button"
                onClick={() => navigate('/open')}
              >
                ¡Empezar a Coleccionar!
              </Button>
            </div>
          </Window>

          <Window 
            title="Pokemon Populares"
            className="home-section"
          >
             <div className="w-full bg-[#c0c0c0] border-2 border-[#808080] border-t-[#ffffff] border-l-[#808080] p-2.5">
              <div className="featured-pokemon-grid">
                {randomPokemon.map(poke => (
                  <div key={poke.id}>
                    <PokemonCard pokemon={poke} />
                  </div>
                ))}
              </div>
            </div>
          </Window>
        </div>
      </div>
    </>
  );
};

export default Home;

