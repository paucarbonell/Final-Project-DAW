import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Window from '../windows-ui/Window';
import Button from '../windows-ui/Button';

const AuthPopup = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(formData.email, formData.password);
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      await register(formData.email, formData.password, formData.username);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Window 
        title={mode === 'login' ? 'Iniciar Sesion' : 'Registrarse'} 
        className="w-[400px] bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-2.5"
      >
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm mb-1">Nombre de usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] bg-white"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] bg-white"
              required
            />
          </div>
          {mode === 'register' && (
            <div>
              <label className="block text-sm mb-1">Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] bg-white"
                required
              />
            </div>
          )}
          <div className="flex justify-between items-center">
            {mode === 'login' ? (
              <button type="button" onClick={() => setMode('register')} className="text-sm text-[#000080] hover:underline focus:outline-none">
                ¿No tienes cuenta? Registrate
              </button>
            ) : (
              <button type="button" onClick={() => setMode('login')} className="text-sm text-[#000080] hover:underline focus:outline-none">
                ¿Ya tienes cuenta? Inicia sesion
              </button>
            )}
            <Button type="submit">
              {mode === 'login' ? 'Iniciar Sesion' : 'Registrarse'}
            </Button>
          </div>
        </form>
      </Window>
    </div>
  );
};

export default AuthPopup; 