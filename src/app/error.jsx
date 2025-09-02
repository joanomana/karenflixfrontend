'use client';

export default function Error({ error, reset }) {
    return (
        <main className="bg-gray-100 min-h-screen">
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Algo salió mal!</h2>
                    <p className="text-gray-600 mb-6">Ocurrió un error al cargar el contenido.</p>
                    <button
                        onClick={reset}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Intentar de nuevo
                    </button>
                </div>
            </div>
        </main>
    );
}
