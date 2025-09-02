
'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/api/users';

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
		if (token) {
			Swal.fire({
				icon: "info",
				title: "Ya estás logeado",
				text: "Redirigiendo a la página principal...",
				timer: 1500,
				showConfirmButton: false,
			});
			setTimeout(() => {
				window.location.href = "/";
			}, 1600);
		}``
	}, [router]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		try {
			const user = await login(email, password);
			if (user && user.token) {
				const userObj = user.user ? user : { user };
				localStorage.setItem("user", JSON.stringify(userObj));
				localStorage.setItem("jwt", user.token);
				Swal.fire({
					icon: "success",
					title: "¡Bienvenido!",
					text:
						userObj.user?.username || userObj.username
							? `Hola, ${userObj.user?.username || userObj.username}`
							: "Inicio de sesión exitoso",
					timer: 1500,
					showConfirmButton: false,
				});
				setTimeout(() => {
					window.location.href = "/";
				}, 1600);
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Credenciales incorrectas",
				});
				setError("Credenciales incorrectas");
			}
		} catch (err) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Error al iniciar sesión",
			});
			setError("Error al iniciar sesión");
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

				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-6"
				>
					<h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Sign In</h2>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
					/>
					<button
						type="submit"
						className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
					>
						Sign In
					</button>
				</form>
				
				<div className="text-center mt-4">
					<span className="text-gray-700">¿No tienes cuenta?</span>
					<button
						type="button"
						onClick={() => router.push("/register")}
						className="ml-2 text-indigo-600 hover:underline font-semibold"
					>
						Regístrate
					</button>
				</div>
				{error && <div className="text-red-600 text-center mt-2">{error}</div>}
			</div>
		</div>
	);
}
		

	

