'use client'
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/api/users';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();
    const { login: loginContext } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const user = await login(email, password);
            if (user && user.token) {
                // Actualiza el contexto global
                loginContext(user, user.token);
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: user.username ? `Hola, ${user.username}` : 'Inicio de sesión exitoso',
                    timer: 1500,
                    showConfirmButton: false
                });
                setTimeout(() => {
                    router.push('/');
                }, 1600);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Credenciales incorrectas',
                });
                setError('Credenciales incorrectas');
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al iniciar sesión',
            });
            setError('Error al iniciar sesión');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Sign In</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                />
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition">Sign In</button>
                {error && <div className="text-red-600 text-center mt-2">{error}</div>}
            </form>
        </div>
    );

};

export default Login;
