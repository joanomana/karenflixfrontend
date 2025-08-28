"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers } from '../../lib/api/users';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
        const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        let user = null;
        try {
            user = userStr ? JSON.parse(userStr) : null;
        } catch {
            user = null;
        }
        if (!token || !user || (user.user?.role !== "admin" && user.role !== "admin")) {
            setError("Acceso denegado. Solo administradores pueden ver esta página.");
            setLoading(false);
            setTimeout(() => router.push("/"), 2000);
            return;
        }
        getUsers()
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Error al cargar usuarios');
                setLoading(false);
            });
    }, [router]);

    if (loading) return <div className="text-center py-20">Cargando...</div>;
    if (error) return <div className="text-center py-20 text-red-600 font-bold">{error}</div>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl flex flex-col gap-6">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Panel de Administrador</h2>
                <p className="text-center text-gray-700 mb-4">Bienvenido al menú de administración. Aquí puedes gestionar usuarios, películas y más.</p>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.nombre} ({user.email})</li>
                    ))}
                </ul>
            </div>
        </div>
    );  
};

export default Admin;