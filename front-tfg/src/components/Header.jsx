import React, { useState } from 'react';
import Window from './windows-ui/Window';
import Button from './windows-ui/Button';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import { Link } from 'react-router-dom';
// Importación de Header.css se eliminará o modificará si todos los estilos son reemplazados
// import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogoutClick = () => {
    logout();
    // Consider adding navigation back to home or clearing state here if needed
  };

  // Close profile menu when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click is outside the profile menu container AND the profile menu button
      const profileMenuContainer = document.querySelector('.profile-menu-container');
      const profileButton = profileMenuContainer?.querySelector('.auth-button');

      if (showProfileMenu && 
          profileMenuContainer && 
          !profileMenuContainer.contains(event.target) &&
          (!profileButton || !profileButton.contains(event.target))
         ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showProfileMenu]);

  return (
    <div className="header-container mb-5 bg-gradient-to-r from-[#000080] to-[#1084d0] p-0.5 fixed top-0 z-50 border-b-2 border-[#808080] w-[800px] left-1/2 -translate-x-1/2">
      <Window 
        title="" // Titulo de la ventana vacio ya que la imagen sera el logo
        className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] w-full"
      >
        <div className="flex justify-between items-center p-2 bg-[#c0c0c0]">
          {/* Elemento flexible vacio a la izquierda para empujar el logo al centro */}
          <div className="flex-grow" style={{ flexBasis: 0 }}></div>
          
          {/* Contenedor central para la imagen del logo */}
          <div className="flex justify-center items-center">
            <img src="/hazteConTodos.png" alt="Pokemon Hazte Con Todos" className="w-auto object-fit" style={{ maxHeight: '90px' }} />
          </div>

          {/* Botones de autenticacion a la derecha */}
          <div className="flex-grow flex justify-end items-center gap-2 bg-[#c0c0c0]" style={{ flexBasis: 0 }}>
            {user ? (
              <div className="profile-menu-container relative flex items-center gap-[5px] bg-[#c0c0c0]"> {/* Container for Profile button and dropdown, adjusted gap */}
                {/* Profile Button (Username) */}
                <button 
                  onClick={toggleProfileMenu} 
                  className="auth-button text-sm px-3 py-1.5" // Apply auth-button style
                >
                  Perfil
                </button>

                {/* Logout Button - Moved outside dropdown */}
                <Button onClick={handleLogoutClick} className="auth-button text-sm px-3 py-1.5"> {/* Apply auth-button style */}
                  Cerrar Sesion
                </Button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="profile-dropdown-menu"> {/* CSS will position this relative to the profile-menu-container */}
                    {/* Inicio Link */}
                    <Link 
                      to="/" 
                      className="profile-dropdown-item"
                      onClick={() => setShowProfileMenu(false)} // Close menu on click
                    >
                      Inicio
                    </Link>
                    {/* Sobres Link */}
                    <Link 
                      to="/packs" 
                      className="profile-dropdown-item"
                      onClick={() => setShowProfileMenu(false)} // Close menu on click
                    >
                      Sobres
                    </Link>
                    {/* Album Link */}
                    <Link 
                      to="/album" 
                      className="profile-dropdown-item"
                      onClick={() => setShowProfileMenu(false)} // Close menu on click
                    >
                       Album
                    </Link>
                    {/* Note: Logout is a separate button */}
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons-container bg-[#c0c0c0]">
                <Button 
                  onClick={() => handleAuthClick('login')}
                  className="auth-button"
                >
                  Iniciar Sesion
                </Button>
                <Button 
                  onClick={() => handleAuthClick('register')}
                  className="auth-button"
                >
                  Registrarse
                </Button>
              </div>
            )}
          </div>
        </div>
      </Window>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode={authMode}
      />
    </div>
  );
}
