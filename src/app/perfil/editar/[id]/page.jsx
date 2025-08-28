"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { users } from "../../../../lib/api/users";
import Swal from "sweetalert2";
import { useAuth } from "../../../../context/AuthContext";

export default function EditProfilePage() {
    const { login, user: currentUser, token: currentToken } = useAuth();
    const router = useRouter();
    const params = useParams();
    const userId = params?.id;
    const [userData, setUserData] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se encontró el usuario."
                });
                setTimeout(() => router.push("/"), 2000);
                return;
            }

            // Verificar que el usuario esté autenticado
            const token = currentToken || (typeof window !== "undefined" ? localStorage.getItem("jwt") : null);
            if (!token) {
                Swal.fire({
                    icon: "error",
                    title: "No autenticado",
                    text: "Debes iniciar sesión para editar un perfil."
                });
                setTimeout(() => router.push("/login"), 2000);
                return;
            }

            // Verificar que el usuario solo pueda editar su propio perfil
            const currentUserId = currentUser?.id || currentUser?.user?.id;
            if (currentUserId && parseInt(userId) !== currentUserId) {
                Swal.fire({
                    icon: "error",
                    title: "No autorizado",
                    text: "Solo puedes editar tu propio perfil."
                });
                setTimeout(() => router.push("/"), 2000);
                return;
            }

            try {
                const res = await users.get(userId, token);
                setUserData({
                    username: res.username || "",
                    email: res.email || "",
                    password: ""
                });
                setLoading(false);
            } catch (err) {
                console.log('Error al obtener usuario:', err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo cargar la información del usuario."
                });
                setTimeout(() => router.push("/"), 2000);
            }
        };

        fetchUserData();
    }, [router, userId, currentToken, currentUser]);

    const handleChange = e => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Cambiar contraseña',
            html:
                '<input id="swal-old-password" type="password" class="swal2-input" placeholder="Contraseña actual">' +
                '<input id="swal-new-password" type="password" class="swal2-input" placeholder="Nueva contraseña">',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const oldPassword = document.getElementById('swal-old-password').value;
                const newPassword = document.getElementById('swal-new-password').value;
                if (!oldPassword || !newPassword) {
                    Swal.showValidationMessage('Debes completar ambos campos');
                }
                return { oldPassword, newPassword };
            }
        });
        
        if (formValues) {
            try {
                const token = currentToken || (typeof window !== "undefined" ? localStorage.getItem("jwt") : null);
                const res = await users.changePassword(userId, formValues.oldPassword, formValues.newPassword, token);
                
                if (res && res.success !== false) {
                    Swal.fire({
                        icon: "success",
                        title: "Contraseña cambiada",
                        text: "Tu contraseña ha sido actualizada correctamente."
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: res?.message || "No se pudo cambiar la contraseña."
                    });
                }
            } catch (err) {
                console.log('Error al cambiar contraseña:', err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.message || "No se pudo cambiar la contraseña."
                });
            }
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        
        try {
            const token = currentToken || (typeof window !== "undefined" ? localStorage.getItem("jwt") : null);
            const res = await users.updateProfile(userId, { 
                username: userData.username, 
                email: userData.email 
            }, token);
            
            if (res && res.success !== false) {
                // Actualizar el localStorage y el contexto de autenticación
                const updatedUser = { ...currentUser, ...res };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                login(updatedUser, token);
                
                Swal.fire({
                    icon: "success",
                    title: "Datos actualizados",
                    text: "Tus datos personales han sido actualizados correctamente."
                });
                
                setTimeout(() => router.push(`/usuario/${userId}`), 1600);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: res?.message || "No se pudo actualizar la información."
                });
            }
        } catch (err) {
            console.log('Error al actualizar perfil:', err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message || "No se pudo actualizar la información."
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
                <div className="text-white text-xl">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Información Actual</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-700">Usuario:</span>
                            <p className="text-gray-900 mt-1">{userData.username}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-700">Email:</span>
                            <p className="text-gray-900 mt-1">{userData.email}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-700">Contraseña:</span>
                            <p className="text-gray-900 mt-1">••••••••</p>
                        </div>
                    </div>
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            <strong>Nota:</strong> Si quieres actualizar tu correo electrónico, debes contactarte con un administrador.
                        </p>
                    </div>
                </div>
                
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Actualizar Información</h2>
                        
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Nuevo nombre de usuario
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Ingresa tu nuevo nombre de usuario"
                                value={userData.username}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                        >
                            Guardar Cambios
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={handlePasswordChange} 
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                        >
                            Cambiar Contraseña
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => router.back()}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
