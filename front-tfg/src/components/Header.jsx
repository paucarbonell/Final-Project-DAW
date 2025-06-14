import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import Window from './windows-ui/Window';

const Header = () => {
    const { isAuthenticated, login, logout } = useAuth();
    const { user } = useUser();
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const loginPopupRef = useRef(null);
    const profilePopupRef = useRef(null);

    const queryClient = useQueryClient();

    const getDailyCoinsMutation = useMutation({
        mutationFn: () => api.post('/user/daily-coins'),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['user']);
            alert(data.data.message);
        },
        onError: (error) => {
            console.error('Error al obtener monedas diarias:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Error al obtener monedas.');
        }
    });

    // Nueva mutación para resetear el contador de sobres diarios
    const resetPackCounterMutation = useMutation({
        mutationFn: () => api.post('/user/reset-pack-counters'),
        onSuccess: () => {
            // Invalidar la query del usuario para refrescar los stats
            queryClient.invalidateQueries(['user']);
            alert('Contador diario de sobres reseteado.'); // Opcional: Mostrar un mensaje al usuario
        },
        onError: (error) => {
            console.error('Error resetting pack counter:', error);
            alert('Error al resetear el contador de sobres.'); // Mostrar error al usuario
        }
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (loginPopupRef.current && !loginPopupRef.current.contains(event.target)) {
                setShowLoginPopup(false);
            }
            if (profilePopupRef.current && !profilePopupRef.current.contains(event.target)) {
                setShowProfilePopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            setShowLoginPopup(false);
            setEmail('');
            setPassword('');
        } else {
            setError(result.error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        const result = await api.post('/auth/register', { name, email, password });
        if (result.success) {
            setShowLoginPopup(false);
            setEmail('');
            setPassword('');
            setName('');
        } else {
            setError(result.error);
        }
    };

    // Función para manejar el clic en el botón de reset
    const handleResetCounterClick = () => {
        resetPackCounterMutation.mutate(); // Ejecutar la mutación
        setShowProfilePopup(false); // Cerrar el popup
    };

    return (
        <div className="header-container mb-5 bg-gradient-to-r from-[#000080] to-[#1084d0] p-0.5 fixed top-0 z-50 border-b-2 border-[#808080] w-[800px] left-1/2 -translate-x-1/2">
            <Window 
                title="" 
                className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] w-full"
            >
                <div className="flex justify-between items-center p-2 bg-[#c0c0c0]">
                    {/* Elemento flexible a la izquierda para las stats del usuario o para empujar el logo */}
                    {isAuthenticated ? (
                        <div className="flex-grow flex justify-start items-center" style={{ flexBasis: 0 }}>
                            <div className="text-sm text-[#000000] ml-4">
                                <div>Monedas: {user?.coins || 0}</div>
                                <div>Sobres abiertos hoy: {user?.daily_pack_count || 0}</div>
                                <div>Total Cartas: {user?.total_cards || 0}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow" style={{ flexBasis: 0 }}></div>
                    )}
                    
                    {/* Contenedor central para la imagen del logo */}
                    <div className="flex justify-center items-center">
                        <img src="/hazteConTodos.png" alt="Pokemon Hazte Con Todos" className="w-auto object-fit" style={{ maxHeight: '90px' }} />
                    </div>

                    {/* Botones de autenticacion/perfil a la derecha */}
                    <div className="flex-grow flex justify-end items-center gap-2 bg-[#c0c0c0]" style={{ flexBasis: 0 }}>
                        {isAuthenticated ? (
                            <div className="profile-menu-container relative flex items-center gap-[5px] bg-[#c0c0c0]">
                                {/* Daily Coins Button */}
                                <div className="flex flex-col items-center">
                                    <button
                                        onClick={() => getDailyCoinsMutation.mutate()}
                                        disabled={getDailyCoinsMutation.isLoading}
                                        className="px-3 py-1.5 text-sm bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] hover:bg-[#d0d0d0] active:border-t-[#808080] active:border-l-[#800080] active:border-r-[#ffffff] active:border-b-[#ffffff]"
                                    >
                                        {getDailyCoinsMutation.isLoading ? 'Obteniendo...' : 'Obtener Monedas'}
                                    </button>
                                </div>

                                {/* Profile Button */}
                                <button
                                    onClick={() => setShowProfilePopup(!showProfilePopup)}
                                    className="px-3 py-1.5 text-sm bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] hover:bg-[#d0d0d0] active:border-t-[#808080] active:border-l-[#800080] active:border-r-[#ffffff] active:border-b-[#ffffff]"
                                >
                                    {user?.name || 'Perfil'}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowLoginPopup(true)}
                                className="px-3 py-1.5 text-sm bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] hover:bg-[#d0d0d0] active:border-t-[#808080] active:border-l-[#800080] active:border-r-[#ffffff] active:border-b-[#ffffff]"
                            >
                                Iniciar sesión
                            </button>
                        )}
                    </div>
                </div>
            </Window>

            {showLoginPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div ref={loginPopupRef} className="w-[400px]">
                        <Window 
                            title={isRegistering ? "Registro" : "Iniciar Sesión"}
                            className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#800080]"
                        >
                            <div className="p-4">
                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                                    {isRegistering && (
                                        <div className="mb-4">
                                            <label className="block text-[#000000] text-sm font-bold mb-2">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-[#800080] border-t-[#ffffff] border-l-[#ffffff] bg-white"
                                                required
                                            />
                                        </div>
                                    )}
                                    <div className="mb-4">
                                        <label className="block text-[#000000] text-sm font-bold mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-[#800080] border-t-[#ffffff] border-l-[#ffffff] bg-white"
                                            required
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-[#000000] text-sm font-bold mb-2">
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-[#800080] border-t-[#ffffff] border-l-[#ffffff] bg-white"
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#800080] border-b-[#800080] hover:bg-[#d0d0d0] active:border-t-[#800080] active:border-l-[#800080] active:border-r-[#ffffff] active:border-b-[#ffffff]"
                                        >
                                            {isRegistering ? 'Registrarse' : 'Iniciar sesión'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsRegistering(!isRegistering)}
                                            className="px-4 py-2 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#800080] border-b-[#800080] hover:bg-[#d0d0d0] active:border-t-[#800080] active:border-l-[#800080] active:border-r-[#ffffff] active:border-b-[#ffffff]"
                                        >
                                            {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Window>
                    </div>
                </div>
            )}

            {/* Este es el popup del perfil que aparecerá fuera del flujo normal del header */}
            {showProfilePopup && (
                <div 
                    ref={profilePopupRef}
                    // Usamos fixed para posicionarlo respecto al viewport
                    // Ajustamos right y top para que aparezca a la derecha del header y ligeramente abajo
                    className="fixed right-[calc(50% - 400px + 20px)] top-[60px] w-[200px] z-50"
                >
                    <Window 
                        title="Menu"
                        className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080]"
                    >
                        <div className="p-2 space-y-1">
                            <Link
                                to="/"
                                className="block px-3 py-1.5 text-sm text-black hover:bg-[#d0d0d0] w-full text-left no-underline"
                                onClick={() => setShowProfilePopup(false)}
                            >
                                Inicio
                            </Link>
                            <Link
                                to="/album"
                                className="block px-3 py-1.5 text-sm text-black hover:bg-[#d0d0d0] w-full text-left no-underline"
                                onClick={() => setShowProfilePopup(false)}
                            >
                                Album
                            </Link>
                            {/* Link para Abrir Sobres */}
                            <Link
                                to="/open"
                                className="block px-3 py-1.5 text-sm text-black hover:bg-[#d0d0d0] w-full text-left no-underline"
                                onClick={() => setShowProfilePopup(false)}
                            >
                                Abrir Sobres
                            </Link>
                            {/* Link para Resetear Contador Diario */}
                            <Link
                                onClick={handleResetCounterClick}
                                className="block px-3 py-1.5 text-sm text-black hover:bg-[#d0d0d0] w-full text-left no-underline disabled:opacity-50 disabled:cursor-not-allowed"
                                to="#"
                            >
                                Resetear contador diario
                            </Link>
                            <Link
                                to="/"
                                onClick={() => {
                                    logout();
                                    setShowProfilePopup(false);
                                }}
                                className="block px-3 py-1.5 text-sm text-black hover:bg-[#d0d0d0] w-full text-left no-underline"
                            >
                                Cerrar sesion
                            </Link>
                        </div>
                    </Window>
                </div>
            )}
        </div>
    );
};

export default Header;
