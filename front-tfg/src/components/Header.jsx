import React, { useState } from 'react';
import Window from './windows-ui/Window';
import Button from './windows-ui/Button';
// Importación de Header.css se eliminará o modificará si todos los estilos son reemplazados
// import './Header.css';

export default function Header({ user, onLogin, onLogout }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');

  const handleLogin = e => {
    e.preventDefault();
    onLogin({ email, password });
  };

  const handleRegister = e => {
    e.preventDefault();
    // Implementar lógica de registro
    setShowRegister(false);
  };

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
                <Button onClick={onLogout} className="text-xs px-2 py-1 bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] text-[#000000] cursor-pointer hover:border-[#808080] hover:border-t-[#ffffff] hover:border-l-[#ffffff] active:border-[#808080] active:border-t-[#ffffff] active:border-l-[#ffffff] active:pt-[5px] active:pr-[7px] active:pb-[3px] active:pl-[9px]">
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 bg-[#c0c0c0]">
                <Button onClick={() => setShowLogin(!showLogin)}>
                  Iniciar Sesión
                </Button>
                <Button onClick={() => setShowRegister(!showRegister)}>
                  Registrarse
                </Button>
                {showLogin && (
                  <Window 
                    title="Iniciar Sesión" 
                    className="absolute right-0 top-9 z-50 border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] bg-[#c0c0c0] w-64"
                    onClose={() => setShowLogin(false)}
                  >
                    <form onSubmit={handleLogin} className="flex flex-col gap-2 p-2 pt-5 bg-[#c0c0c0]">
                      <div className="flex flex-col gap-1 bg-[#c0c0c0]">
                        <label className="text-xs text-[#000000] bg-[#c0c0c0] font-bold">Email:</label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          className="bg-[#ffffff] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-1 text-xs font-['MS Sans Serif','Segoe UI','Tahoma','Geneva','Verdana',sans-serif] focus:outline focus:outline-1 focus:outline-[#000000] focus:outline-offset-[-4px]"
                        />
                      </div>
                      <div className="flex flex-col gap-1 bg-[#c0c0c0]">
                        <label className="text-xs text-[#000000] bg-[#c0c0c0] font-bold">Contraseña:</label>
                        <input
                          type="password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required
                          minLength={8}
                          className="bg-[#ffffff] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-1 text-xs font-['MS Sans Serif','Segoe UI','Tahoma','Geneva','Verdana',sans-serif] focus:outline focus:outline-1 focus:outline-[#000000] focus:outline-offset-[-4px]"
                        />
                      </div>
                      <Button type="submit" className="mt-2 self-end bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] px-2 py-1 text-xs text-[#000000] cursor-pointer hover:border-[#808080] hover:border-t-[#ffffff] hover:border-l-[#ffffff] active:border-[#808080] active:border-t-[#ffffff] active:border-l-[#ffffff] active:pt-[5px] active:pr-[7px] active:pb-[3px] active:pl-[9px]">
                        Entrar
                      </Button>
                    </form>
                  </Window>
                )}
                {showRegister && (
                  <Window 
                    title="Registro" 
                    className="absolute right-0 top-9 z-50 border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] bg-[#c0c0c0] w-64"
                    onClose={() => setShowRegister(false)}
                  >
                    <form onSubmit={handleRegister} className="flex flex-col gap-2 p-2 pt-5 bg-[#c0c0c0]">
                      <div className="flex flex-col gap-1 bg-[#c0c0c0]">
                        <label className="text-xs text-[#000000] bg-[#c0c0c0] font-bold">Nombre:</label>
                        <input
                          type="text"
                          value={registerName}
                          onChange={e => setRegisterName(e.target.value)}
                          required
                          className="bg-[#ffffff] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-1 text-xs font-['MS Sans Serif','Segoe UI','Tahoma','Geneva','Verdana',sans-serif] focus:outline focus:outline-1 focus:outline-[#000000] focus:outline-offset-[-4px]"
                        />
                      </div>
                      <div className="flex flex-col gap-1 bg-[#c0c0c0]">
                        <label className="text-xs text-[#000000] bg-[#c0c0c0] font-bold">Email:</label>
                        <input
                          type="email"
                          value={registerEmail}
                          onChange={e => setRegisterEmail(e.target.value)}
                          required
                          className="bg-[#ffffff] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-1 text-xs font-['MS Sans Serif','Segoe UI','Tahoma','Geneva','Verdana',sans-serif] focus:outline focus:outline-1 focus:outline-[#000000] focus:outline-offset-[-4px]"
                        />
                      </div>
                      <div className="flex flex-col gap-1 bg-[#c0c0c0]">
                        <label className="text-xs text-[#000000] bg-[#c0c0c0] font-bold">Contraseña:</label>
                        <input
                          type="password"
                          value={registerPassword}
                          onChange={e => setRegisterPassword(e.target.value)}
                          required
                          minLength={8}
                          className="bg-[#ffffff] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-1 text-xs font-['MS Sans Serif','Segoe UI','Tahoma','Geneva','Verdana',sans-serif] focus:outline focus:outline-1 focus:outline-[#000000] focus:outline-offset-[-4px]"
                        />
                      </div>
                      <Button type="submit" className="mt-2 self-end bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] px-2 py-1 text-xs text-[#000000] cursor-pointer hover:border-[#808080] hover:border-t-[#ffffff] hover:border-l-[#ffffff] active:border-[#808080] active:border-t-[#ffffff] active:border-l-[#ffffff] active:pt-[5px] active:pr-[7px] active:pb-[3px] active:pl-[9px]">
                        Registrarse
                      </Button>
                    </form>
                  </Window>
                )}
              </div>
            )}
          </div>
        </div>
      </Window>
    </div>
  );
}
