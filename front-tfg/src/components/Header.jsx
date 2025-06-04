import React, { useState } from 'react';
import Window from './windows-ui/Window';
import Button from './windows-ui/Button';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
// Importación de Header.css se eliminará o modificará si todos los estilos son reemplazados
// import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="w-full mb-5 bg-gradient-to-r from-[#000080] to-[#1084d0] p-0.5 fixed top-0 left-0 right-0 z-50 border-b-2 border-[#808080]">
      <Window 
        title="Pokémon Card Collection" 
        className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] w-full"
      >
        <div className="flex justify-between items-center p-2 bg-[#c0c0c0]">
          <div className="flex items-center gap-2 bg-[#c0c0c0]">
            <img src="/assets/pokemon-icon.png" alt="Pokémon" className="w-6 h-6 border border-[#808080] border-t-[#ffffff] border-l-[#ffffff] p-px bg-[#c0c0c0]" />
            <h1 className="text-sm text-[#000080] m-0 drop-shadow-[1px_1px_0_#ffffff] font-bold">Pokémon Card Collection</h1>
          </div>

          <div className="flex items-center gap-2 bg-[#c0c0c0]">
            {user ? (
              <div className="flex items-center gap-2 bg-[#c0c0c0]">
                <span className="text-xs text-[#000000] bg-[#c0c0c0]">Hola, {user.name}</span>
                <Button onClick={logout} className="text-xs px-2 py-1 bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] text-[#000000] cursor-pointer hover:border-[#808080] hover:border-t-[#ffffff] hover:border-l-[#ffffff] active:border-[#808080] active:border-t-[#ffffff] active:border-l-[#ffffff] active:pt-[5px] active:pr-[7px] active:pb-[3px] active:pl-[9px]">
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 bg-[#c0c0c0]">
                <Button onClick={() => setShowAuthModal(true)}>
                  Iniciar Sesión
                </Button>
                <Button onClick={() => setShowAuthModal(true)}>
                  Registrarse
                </Button>
              </div>
            )}
          </div>
        </div>
      </Window>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
