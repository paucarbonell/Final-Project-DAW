import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Window from '../windows-ui/Window';
import Button from '../windows-ui/Button';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const { login, register } = useAuth();

  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password, formData.password_confirmation);
      }
      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <Window 
        title={isLogin ? 'Iniciar Sesion' : 'Registrarse'}
        className="auth-modal-container bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] w-11/12 max-w-md"
        onClose={onClose}
      >
        <div className="p-4 bg-[#c0c0c0]">
          <form onSubmit={handleSubmit} className="auth-modal-form flex flex-col gap-4">
            {!isLogin && (
              <div className="auth-modal-input-group">
                <label htmlFor="name" className="block text-sm text-[#000000]">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] bg-white text-[#000000] focus:outline-none"
                />
              </div>
            )}
            <div className="auth-modal-input-group">
              <label htmlFor="email" className="block text-sm text-[#000000]">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] bg-white text-[#000000] focus:outline-none"
              />
            </div>
            <div className="auth-modal-input-group">
              <label htmlFor="password" className="block text-sm text-[#000000]">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-2 border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] bg-white text-[#000000] focus:outline-none"
              />
            </div>
            {!isLogin && (
              <div className="auth-modal-input-group">
                <label htmlFor="password_confirmation" className="block text-sm text-[#000000]">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] bg-white text-[#000000] focus:outline-none"
                />
              </div>
            )}
            <div className="auth-modal-buttons-container">
              {isLogin ? (
                <button type="button" onClick={() => setIsLogin(false)} className="auth-switch-button">
                  ¿No tienes cuenta? Registrate
                </button>
              ) : (
                <button type="button" onClick={() => setIsLogin(true)} className="auth-switch-button">
                  ¿Ya tienes cuenta? Inicia sesion
                </button>
              )}
              <Button type="submit" className="auth-modal-main-button">
                {isLogin ? 'Iniciar Sesion' : 'Registrarse'}
              </Button>
            </div>
          </form>
        </div>
      </Window>
    </div>
  );
};

export default AuthModal; 