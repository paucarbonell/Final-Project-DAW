import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PackCard from '../components/packs/PackCard';
import PokemonCard from '../components/cards/PokemonCard';
import { useAuth } from '../contexts/AuthContext';
import Window from '../components/windows-ui/Window';
import Button from '../components/windows-ui/Button';
// import './Home.css'; // Se eliminará o modificará al final

const Home = () => {
  const { user } = useAuth();

  const { data: featuredPacks, isLoading: packsLoading } = useQuery({
    queryKey: ['featuredPacks'],
    queryFn: async () => {
      const response = await axios.get('/api/cards');
      return response.data;
    }
  });

  const { data: featuredPokemon, isLoading: pokemonLoading } = useQuery({
    queryKey: ['featuredPokemon'],
    queryFn: async () => {
      const response = await axios.get('/api/pokemon');
      return response.data;
    }
  });

  if (packsLoading || pokemonLoading) {
    return (
      <div className="flex justify-center items-start p-0 pb-5 px-5 w-full box-border"> {/* retro-page - No margin top here */}
        <div className="w-[800px] flex flex-col gap-5 relative mx-auto mb-5"> {/* retro-content - No margin top here */}
          <Window title="Cargando..." className="mt-5"> {/* Added margin top to the window */}
            <div className="text-center p-5 text-sm text-[#000080] bg-[#c0c0c0]">Cargando contenido...</div> {/* loading-text */}
          </Window>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start p-0 pb-5 px-5 w-full box-border"> {/* retro-page - No margin top here */}
      <div className="w-[800px] flex flex-col gap-5 relative mx-auto mb-5"> {/* retro-content - No margin top here */}
        <Window 
          title="Bienvenido a Pokémon Card Collection" 
          className="mb-5 bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-2.5 mt-5" /* main-window - Added margin top */
        >
          <div className="text-center p-5 bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080]"> {/* hero-section ajustado bordes*/}
            <h1 className="text-2xl mb-2.5 text-[#000080] drop-shadow-[1px_1px_0_#ffffff] font-bold">Pokémon Card Collection</h1> {/* hero-section h1 */}
            <p className="text-sm mb-5 text-[#000000]">Colecciona, intercambia y descubre nuevos Pokémon en cada sobre</p> {/* hero-section p */}
            {!user && (
              <Button className="text-sm px-4 py-2 min-w-[200px] bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] text-[#000000] cursor-pointer font-['MS Sans Serif','Segoe UI','Tahoma','Geneva','Verdana',sans-serif] hover:border-[#808080] hover:border-t-[#ffffff] hover:border-l-[#ffffff] active:border-[#808080] active:border-t-[#ffffff] active:border-l-[#ffffff] active:pt-[9px] active:pr-[15px] active:pb-[7px] active:pl-[17px]"> {/* cta-button */}
                Comenzar a Coleccionar
              </Button>
            )}
          </div>
        </Window>

        <Window 
          title="Sobres Destacados" 
          className="mb-5 bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-2.5" /* section-window */
        >
          <div className="grid grid-cols-auto-fill-minmax-200 gap-5 p-2.5 bg-[#c0c0c0]"> {/* packs-grid */}
            {featuredPacks?.map(pack => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </Window>

        <Window 
          title="Pokémon Destacados" 
          className="mb-5 bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-2.5" /* section-window */
        >
          <div className="grid grid-cols-auto-fill-minmax-200 gap-5 p-2.5 bg-[#c0c0c0]"> {/* pokemon-grid */}
            {featuredPokemon?.map(pokemon => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        </Window>
      </div>
    </div>
  );
};

export default Home;

