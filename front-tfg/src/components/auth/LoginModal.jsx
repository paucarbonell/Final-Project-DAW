import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../windows-ui/Button';
import Window from '../windows-ui/Window';

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await register({ name, email, password });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
      <Window 
        title={isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] w-11/12 max-w-md"
        onClose={onClose}
      >
        <div className="relative p-4 pt-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#000000] font-bold">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-[#ffffff] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-1 text-sm font-['MS Sans Serif','Segoe UI','Tahoma','Geneva','Verdana',sans-serif] focus:outline focus:outline-1 focus:outline-[#000000] focus:outline-offset-[-4px]"
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#000000] font-bold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                 className="bg-[#ffffff] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-1 text-sm font-['MS Sans Serif','Segoe UI','Tahoma','Geneva','Verdana',sans-serif] focus:outline focus:outline-1 focus:outline-[#000000] focus:outline-offset-[-4px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#000000] font-bold">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                 className="bg-[#ffffff] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-1 text-sm font-['MS Sans Serif','Segoe UI','Tahoma','Geneva','Verdana',sans-serif] focus:outline focus:outline-1 focus:outline-[#000000] focus:outline-offset-[-4px]"
              />
            </div>
            <button type="submit" className="mt-4 self-end bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] px-4 py-2 text-sm text-[#000000] cursor-pointer font-['MS Sans Serif','Segoe UI','Tahoma','Geneva','Verdana',sans-serif] hover:border-[#808080] hover:border-t-[#ffffff] hover:border-l-[#ffffff] active:border-[#808080] active:border-t-[#ffffff] active:border-l-[#ffffff] active:pt-[9px] active:pr-[15px] active:pb-[7px] active:pl-[17px]">
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </form>
          <div className="text-center mt-4">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button onClick={() => setIsLogin(!isLogin)} className="ml-1 text-sm text-[#000080] underline cursor-pointer bg-transparent border-none p-0">
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </div>
        </div>
      </Window>
    </div>
  );
};

export default LoginModal; 