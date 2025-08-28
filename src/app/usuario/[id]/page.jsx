"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUserById } from "../../../lib/api/users";
import { useAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2";

export default function UserProfilePage() {
    const { user: currentUser, token } = useAuth();
    const router = useRouter();
    const params = useParams();
    const userId = params?.id;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se encontró el usuario."
                });
                router.push("/");
                return;
            }

            try {
                const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("jwt") : null);
                const res = await getUserById(userId, authToken);
                setUserData(res);
                setLoading(false);
            } catch (err) {
                console.log('Error al obtener usuario:', err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo cargar la información del usuario."
                });
                router.push("/");
            }
        };

        fetchUserData();
    }, [userId, token, router]);

    const isOwnProfile = currentUser && currentUser.id === parseInt(userId);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
                <div className="text-white text-xl">Cargando perfil...</div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
                <div className="text-white text-xl">Usuario no encontrado</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header del perfil */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-center">
                        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-3xl font-bold text-indigo-600">
                                {userData.username?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">{userData.username}</h1>
                        <p className="text-indigo-100">{userData.email}</p>
                        {isOwnProfile && (
                            <button
                                onClick={() => router.push(`/perfil/editar/${userId}`)}
                                className="mt-4 bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Editar Perfil
                            </button>
                        )}
                    </div>

                    {/* Contenido del perfil */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Información Personal</h2>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <label className="font-semibold text-gray-700">Nombre de Usuario:</label>
                                        <p className="text-gray-900 mt-1">{userData.username}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <label className="font-semibold text-gray-700">Email:</label>
                                        <p className="text-gray-900 mt-1">{userData.email}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <label className="font-semibold text-gray-700">Fecha de registro:</label>
                                        <p className="text-gray-900 mt-1">
                                            {userData.createdAt 
                                                ? new Date(userData.createdAt).toLocaleDateString('es-ES')
                                                : 'No disponible'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Estadísticas</h2>
                                <div className="space-y-4">
                                    <div className="p-4 bg-indigo-50 rounded-lg">
                                        <label className="font-semibold text-indigo-700">Películas favoritas:</label>
                                        <p className="text-indigo-900 text-2xl font-bold mt-1">0</p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <label className="font-semibold text-purple-700">Reseñas escritas:</label>
                                        <p className="text-purple-900 text-2xl font-bold mt-1">0</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <label className="font-semibold text-green-700">Puntuación promedio:</label>
                                        <p className="text-green-900 text-2xl font-bold mt-1">-</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.push("/")}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Volver al Inicio
                            </button>
                            {isOwnProfile && (
                                <button
                                    onClick={() => router.push(`/perfil/editar/${userId}`)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Editar Perfil
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}