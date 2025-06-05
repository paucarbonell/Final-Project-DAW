import React, { useState } from 'react';
import Window from '../components/windows-ui/Window';
import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import PokemonCard from '../components/cards/PokemonCard';
import LoadingWindow from '../components/windows-ui/LoadingWindow';

const Album = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: paginationData, isLoading } = useQuery({
    queryKey: ['userCards', user?.id, currentPage],
    queryFn: async () => {
      const response = await axios.get(`/user/cards?page=${currentPage}`);
      return response.data;
    },
    enabled: !!user,
  });

  const userCards = paginationData?.data;
  const totalPages = paginationData?.last_page;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-[#000000]">
        <Window 
          title="Acceso Restringido"
          className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-4 w-11/12 max-w-md text-center"
        >
           <p>Por favor, inicia sesion para ver tu álbum.</p>
        </Window>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingWindow />;
  }

  if (!Array.isArray(userCards)) {
      return (
          <div className="flex justify-center items-center h-screen text-[#000000]">
              <Window 
                  title="Error al cargar Álbum"
                  className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-4 w-11/12 max-w-md text-center"
              >
                 <p>Hubo un error al cargar tus cartas.</p>
              </Window>
          </div>
      );
  }

  return (
    <>
       <div className="flex justify-center pb-5 px-5 w-full box-border">
         <div className="w-[800px] relative mx-auto mb-5">
           <Window 
             title="Mi Álbum de Cromos"
             className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-2.5"
           >
             <div className="p-5 bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080]">
               <div className="featured-pokemon-grid">
                 {userCards.map(card => (
                   <div key={card.id}>
                     <PokemonCard pokemon={card} />
                   </div>
                 ))}
               </div>
             </div>
           </Window>
         </div>
       </div>
       {/* Pagination Controls */}
       {totalPages > 1 && (
         <div className="flex justify-center mt-4 text-[#000000]">
           <Window
             title="Navegación"
             className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-2.5"
           >
             <div className="flex items-center space-x-4">
               <button
                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                 disabled={currentPage === 1}
                 className="auth-button"
               >
                 Anterior
               </button>
               <span>
                 Página {currentPage} de {totalPages}
               </span>
               <button
                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                 disabled={currentPage === totalPages}
                 className="auth-button"
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
  