'use client'
import React, { useState } from 'react';
import { register } from '../../lib/api/users';

const Register = ({ onRegister }) => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError(null);
            setSuccess(null);
            try {
                const user = await register({ nombre, email, password });
                if (user) {
                    setSuccess('Registro exitoso');
                    onRegister && onRegister(user);
                } else {
                    setError('No se pudo registrar');
                }
            } catch (err) {
                setError('Error al registrar');
            }
        };
    
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Sign Up</h2>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
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
                    <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition">Sign Up</button>
                    {error && <div className="text-red-600 text-center mt-2">{error}</div>}
                    {success && <div className="text-green-600 text-center mt-2">{success}</div>}
                </form>
            </div>
    );
}

export default Register;
