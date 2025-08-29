import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export const useAdminAuth = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const router = useRouter();
    const { user, token } = useAuth();

    useEffect(() => {
        const validateAuthAndUser = () => {
            const tokenFromStorage = token || (typeof window !== "undefined" ? localStorage.getItem("jwt") : null);
            const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
            let userData = user;
            
            if (!userData && userStr) {
                try {
                    userData = JSON.parse(userStr);
                } catch {
                    userData = null;
                }
            }

            // Validar token
            if (!tokenFromStorage) {
                setError("No se encontró token de autenticación. Por favor, inicia sesión nuevamente.");
                setLoading(false);
                setTimeout(() => router.push("/login"), 2000);
                return;
            }

            // Validar usuario
            if (!userData) {
                setError("No se encontró información del usuario. Por favor, inicia sesión nuevamente.");
                setLoading(false);
                setTimeout(() => router.push("/login"), 2000);
                return;
            }

            // Validar permisos de administrador
            const userRole = userData.user?.role || userData.role;
            if (userRole !== "admin") {
                setError("Acceso denegado. Solo administradores pueden ver esta página.");
                setLoading(false);
                setTimeout(() => router.push("/"), 2000);
                return;
            }

            // Si todo es válido, establecer el estado
            const userIdExtracted = userData.user?.id || userData.id || userData._id;
            setAuthToken(tokenFromStorage);
            setCurrentUser(userData);
            setUserId(userIdExtracted);
            setLoading(false);
        };

        validateAuthAndUser();
    }, [router, user, token]);

    // Función para validar token antes de hacer llamadas API
    const validateTokenBeforeAction = () => {
        if (!authToken) {
            Swal.fire('Error', 'Token de autenticación no disponible. Por favor, recarga la página.', 'error');
            return false;
        }
        return true;
    };

    // Función para manejar errores de API de manera centralizada
    const handleApiError = (error, defaultMessage = 'Ocurrió un error') => {
        console.error('API Error:', error);
        
        if (error.status === 401) {
            Swal.fire('Sesión Expirada', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'warning')
                .then(() => router.push("/login"));
        } else if (error.status === 403) {
            Swal.fire('Acceso Denegado', 'No tienes permisos para realizar esta acción.', 'error');
        } else if (error.message && error.message.includes('ID inválido')) {
            Swal.fire('Error', 'ID de usuario inválido. Verifica que el usuario existe.', 'error');
        } else {
            Swal.fire('Error', error.data?.message || error.message || defaultMessage, 'error');
        }
    };

    return {
        loading,
        error,
        authToken,
        currentUser,
        userId,
        validateTokenBeforeAction,
        handleApiError
    };
};
