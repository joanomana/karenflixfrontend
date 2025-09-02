"use client";
import React, { useState, useEffect } from 'react';
import { getUsers } from '../../lib/api/users';

const AdminDashboard = ({ authToken, currentUser, userId, validateTokenBeforeAction, handleApiError }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!validateTokenBeforeAction()) return;

            try {
                const usersData = await getUsers(authToken);
                setUsers(usersData);
            } catch (error) {
                handleApiError(error, 'No se pudieron cargar las estadísticas');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [authToken, validateTokenBeforeAction, handleApiError]);

    const totalUsers = users.length;

    return (
        <div className="w-full mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>
            <p className="text-gray-600 mb-4">
                Total de usuarios: {loading ? 'Cargando...' : totalUsers}
            </p>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Bienvenido al Panel de Control</h2>
                <p className="text-gray-600 mb-4">
                    Desde aquí puedes gestionar todos los aspectos de la plataforma. Utiliza el menú lateral para navegar entre las diferentes secciones.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">👥</span>
                        <h3 className="text-lg font-semibold text-blue-800">Gestión de Usuarios</h3>
                    </div>
                    <p className="text-blue-700 text-sm mb-3">
                        Administra usuarios registrados en la plataforma
                    </p>
                    <ul className="text-blue-600 text-sm space-y-1">
                        <li>• Crear nuevos usuarios</li>
                        <li>• Editar información de usuarios</li>
                        <li>• Cambiar roles y permisos</li>
                        <li>• Eliminar usuarios</li>
                    </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">⏳</span>
                        <h3 className="text-lg font-semibold text-yellow-800">Contenido Pendiente</h3>
                    </div>
                    <p className="text-yellow-700 text-sm mb-3">
                        Revisa y modera el contenido enviado por usuarios
                    </p>
                    <ul className="text-yellow-600 text-sm space-y-1">
                        <li>• Ver contenido pendiente de aprobación</li>
                        <li>• Aprobar o rechazar contenido</li>
                        <li>• Editar información del contenido</li>
                        <li>• Eliminar contenido inapropiado</li>
                    </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">🎬</span>
                        <h3 className="text-lg font-semibold text-green-800">Gestión de Media</h3>
                    </div>
                    <p className="text-green-700 text-sm mb-3">
                        Administra todo el contenido multimedia
                    </p>
                    <ul className="text-green-600 text-sm space-y-1">
                        <li>• Listar todas las películas/series</li>
                        <li>• Filtrar por categoría</li>
                        <li>• Buscar por nombre</li>
                        <li>• Editar y eliminar contenido</li>
                    </ul>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas Generales</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">--</div>
                        <div className="text-sm text-gray-600">Total Usuarios</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">--</div>
                        <div className="text-sm text-gray-600">Contenido Pendiente</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">--</div>
                        <div className="text-sm text-gray-600">Media Publicada</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">--</div>
                        <div className="text-sm text-gray-600">Actividad Hoy</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
