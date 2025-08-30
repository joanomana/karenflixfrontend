"use client";
import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser } from '../../lib/api/users';
import Swal from 'sweetalert2';

// Agregar estilos CSS responsivos para SweetAlert2
const responsiveStyles = `
<style>
@media (max-width: 768px) {
    .swal-responsive .swal2-popup {
        width: 95vw !important;
        margin: 10px !important;
        padding: 15px !important;
    }
    .swal-responsive .swal2-title {
        font-size: 18px !important;
    }
    .swal-responsive .swal2-input,
    .swal-responsive .swal2-select {
        font-size: 16px !important;
        padding: 12px !important;
        margin: 5px 0 !important;
    }
    .swal-responsive .swal2-actions {
        flex-direction: column;
        gap: 10px;
    }
    .swal-responsive .swal2-confirm,
    .swal-responsive .swal2-cancel {
        width: 100% !important;
        margin: 0 !important;
    }
}
</style>
`;

const UsersManagement = ({ authToken, currentUser, userId, validateTokenBeforeAction, handleApiError }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        if (!validateTokenBeforeAction()) return;
        
        try {
            setLoading(true);
            const data = await getUsers(authToken);
            setUsers(data);
        } catch (error) {
            handleApiError(error, 'No se pudieron cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener el ID del usuario
    const getUserId = (user) => {
        return user.id || user._id || user.userId || user.user?.id;
    };

    const handleDeleteUser = async (user, username) => {
        const userIdToDelete = getUserId(user);

        // Validar que el userId existe y es válido
        if (!userIdToDelete || userIdToDelete === undefined || userIdToDelete === null) {
            Swal.fire('Error', 'ID de usuario no válido. No se puede eliminar el usuario.', 'error');
            console.error('Invalid userId:', userIdToDelete);
            console.error('User object:', user);
            return;
        }

        if (!validateTokenBeforeAction()) return;

        console.log('Attempting to delete user with ID:', userIdToDelete, 'Username:', username);

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Se eliminará el usuario "${username}" permanentemente`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                console.log('Deleting user with ID:', userIdToDelete, 'Token:', authToken ? 'Present' : 'Missing');
                await deleteUser(userIdToDelete, authToken);
                await loadUsers();
                Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
            } catch (error) {
                console.error('Error eliminando usuario:', error);
                console.error('Error details:', { userIdToDelete, username, error: error.message });
                handleApiError(error, 'No se pudo eliminar el usuario');
            }
        }
    };

    const handleRoleChange = async (user, newRole, username) => {
        const userIdToUpdate = getUserId(user);

        // Validar que el userId existe y es válido
        if (!userIdToUpdate || userIdToUpdate === undefined || userIdToUpdate === null) {
            Swal.fire('Error', 'ID de usuario no válido. No se puede cambiar el rol.', 'error');
            console.error('Invalid userId for role change:', userIdToUpdate);
            console.error('User object:', user);
            return;
        }

        if (!validateTokenBeforeAction()) return;

        console.log('Attempting to change role for user ID:', userIdToUpdate, 'to role:', newRole);

        const result = await Swal.fire({
            title: 'Cambiar Rol',
            text: `¿Cambiar el rol del usuario "${username}" a "${newRole}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Cambiar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await updateUser(userIdToUpdate, { role: newRole }, authToken);
                await loadUsers();
                Swal.fire('Actualizado', 'Rol cambiado correctamente', 'success');
            } catch (error) {
                console.error('Error cambiando rol:', error);
                console.error('Error details:', { userIdToUpdate, newRole, username, error: error.message });
                handleApiError(error, 'No se pudo cambiar el rol');
            }
        }
    };

    const handleEditUser = async (user) => {
        const userIdToEdit = getUserId(user);

        if (!userIdToEdit) {
            Swal.fire('Error', 'ID de usuario no válido. No se puede editar el usuario.', 'error');
            return;
        }

        if (!validateTokenBeforeAction()) return;

        const { value: formValues } = await Swal.fire({
            title: 'Editar Usuario',
            html: `
                ${responsiveStyles}
                <div style="display: flex; flex-direction: column; gap: 20px; text-align: left;">
                    <!-- Vista móvil: stack vertical -->
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <!-- Datos actuales -->
                        <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
                            <h4 style="margin-top: 0; color: #495057; font-size: 14px; font-weight: bold;">DATOS ACTUALES</h4>
                            <div style="margin: 10px 0;">
                                <strong>Nombre de usuario:</strong><br>
                                <span style="color: #6c757d;">${user.username || 'Sin nombre'}</span>
                            </div>
                            <div style="margin: 10px 0;">
                                <strong>Email:</strong><br>
                                <span style="color: #6c757d;">${user.email || 'Sin email'}</span>
                            </div>
                        </div>
                        <!-- Formulario de edición -->
                        <div style="padding: 15px;">
                            <h4 style="margin-top: 0; color: #495057; font-size: 14px; font-weight: bold;">NUEVOS DATOS</h4>
                            <div style="margin: 10px 0;">
                                <label for="swal-input1" style="display: block; font-weight: bold; margin-bottom: 5px;">Nombre de usuario:</label>
                                <input id="swal-input1" class="swal2-input" placeholder="Nuevo nombre de usuario" value="${user.username || ''}" style="width: 100%; margin: 0; font-size: 16px;">
                            </div>
                            <div style="margin: 10px 0;">
                                <label for="swal-input2" style="display: block; font-weight: bold; margin-bottom: 5px;">Email:</label>
                                <input id="swal-input2" class="swal2-input" type="email" placeholder="Nuevo email" value="${user.email || ''}" style="width: 100%; margin: 0; font-size: 16px;">
                            </div>
                        </div>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar Cambios',
            cancelButtonText: 'Cancelar',
            width: 'auto',
            customClass: {
                container: 'swal-responsive',
                popup: 'swal-responsive-popup',
                content: 'swal-responsive-content'
            },
            preConfirm: () => {
                const username = document.getElementById('swal-input1').value;
                const email = document.getElementById('swal-input2').value;

                if (!username.trim()) {
                    Swal.showValidationMessage('El nombre de usuario es requerido');
                    return false;
                }

                if (!email.trim()) {
                    Swal.showValidationMessage('El email es requerido');
                    return false;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    Swal.showValidationMessage('El email no tiene un formato válido');
                    return false;
                }

                return {
                    username: username.trim(),
                    email: email.trim(),
                };
            }
        });

        if (formValues) {
            try {
                console.log('Updating user with ID:', userIdToEdit, 'New data:', formValues);
                await updateUser(userIdToEdit, formValues, authToken);
                await loadUsers();
                
                Swal.fire({
                    title: 'Actualizado',
                    text: 'Usuario actualizado correctamente',
                    icon: 'success',
                    timer: 2000
                });
            } catch (error) {
                console.error('Error actualizando usuario:', error);
                handleApiError(error, 'No se pudo actualizar el usuario');
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'all' ||
            user.role === selectedRole ||
            user.user?.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    if (loading) return <div className="text-center py-20">Cargando usuarios...</div>;

    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-90 text-center">Gestión de Usuarios</h1>
            </div>
            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Rol</label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        >
                            <option value="all">Todos los roles</option>
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla de usuarios - Vista Desktop */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rol
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Registro
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user, index) => (
                                <tr key={getUserId(user) || `user-${index}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {user.username?.charAt(0).toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.username || 'Sin nombre'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.email || 'Sin email'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.role || user.user?.role || 'user'}
                                            onChange={(e) => handleRoleChange(user, e.target.value, user.username)}
                                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="user">Usuario</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Sin fecha'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user, user.username)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No se encontraron usuarios que coincidan con los filtros
                    </div>
                )}
            </div>

            {/* Vista Mobile/Tablet - Cards */}
            <div className="lg:hidden space-y-4">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md">
                        No se encontraron usuarios que coincidan con los filtros
                    </div>
                ) : (
                    filteredUsers.map((user, index) => (
                        <div key={getUserId(user) || `user-${index}`} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                            {/* Header del card con avatar y nombre */}
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-lg sm:text-xl font-medium text-gray-700">
                                            {user.username?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 truncate">
                                        {user.username || 'Sin nombre'}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-500 truncate">
                                        {user.email || 'Sin email'}
                                    </p>
                                </div>
                            </div>

                            {/* Información del usuario en grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">Rol</label>
                                    <select
                                        value={user.role || user.user?.role || 'user'}
                                        onChange={(e) => handleRoleChange(user, e.target.value, user.username)}
                                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="user">Usuario</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">Fecha de Registro</label>
                                    <p className="text-sm text-gray-900 py-2">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Sin fecha'}
                                    </p>
                                </div>
                            </div>


                            {/* Botones de acción */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <button
                                    onClick={() => handleEditUser(user)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                >
                                    ✏️ Editar Usuario
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user, user.username)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UsersManagement;
