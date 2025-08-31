"use client";
import React, { useState, useEffect } from "react";
import { register } from "../../lib/api/users";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const validateForm = () => {
        if (username.length < 3 || username.length > 30) {
            return 'El nombre de usuario debe tener entre 3 y 30 caracteres';
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos';
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return 'Email inválido';
        }
        if (password.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres';
        }
        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[a-z]/.test(password)) {
            return 'La contraseña debe contener al menos una minúscula, una mayúscula y un número';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: validationError,
            });
            return;
        }
        try {
            const registerResponse = await register({ username, email, password });
            if (registerResponse && registerResponse.errors) {
                Swal.fire({
                    icon: 'error',
                    title: 'Errores de validación',
                    html: `<ul style='text-align:left;'>${registerResponse.errors.map(e => `<li>${e.msg}</li>`).join('')}</ul>`,
                });
            } else if (registerResponse && registerResponse.message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: registerResponse.message,
                });
            } else if (registerResponse && (registerResponse.user || registerResponse.username)) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: `Bienvenido, ${registerResponse.user?.username || registerResponse.username}. Ahora puedes iniciar sesión.`,
                    timer: 1600,
                    showConfirmButton: false,
                    willClose: () => {
                        router.push('/login');
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo registrar',
                });
            }
        } catch (err) {
            if (err && err.errors) {
                Swal.fire({
                    icon: 'error',
                    title: 'Errores de validación',
                    html: `<ul style='text-align:left;'>${err.errors.map(e => `<li>${e.msg}</li>`).join('')}</ul>`,
                });
            } else if (err && err.message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al registrar',
                });
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                {/* Botón Volver a Inicio */}
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Volver a inicio
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Sign Up</h2>
                    <input
                        type="text"
                        placeholder="Nombre de usuario "
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                    />
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
                    <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition">
                        Sign Up
                    </button>
                </form>

                {/* Enlace a Login */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        ¿Ya estás registrado?{' '}
                        <button
                            type="button"
                            onClick={() => router.push('/login')}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold underline transition-colors"
                        >
                            Inicia sesión
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
