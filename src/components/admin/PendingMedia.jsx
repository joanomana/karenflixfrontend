"use client";
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const PendingMedia = ({ authToken, currentUser, userId, validateTokenBeforeAction, handleApiError }) => {
    const [pendingContent, setPendingContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        loadPendingContent();
    }, []);

    const loadPendingContent = async () => {
        if (!validateTokenBeforeAction()) return;
        
        try {
            setLoading(true);
            // Aquí harías la llamada a la API para obtener contenido pendiente
            // const data = await getPendingContent(authToken);
            
            // Datos de ejemplo mientras no tengamos la API
            const mockData = [
                {
                    id: 1,
                    title: "Película de Acción 2024",
                    type: "movie",
                    category: "Acción",
                    submittedBy: "usuario1",
                    submittedAt: "2024-01-15T10:30:00Z",
                    description: "Una película emocionante con mucha acción...",
                    status: "pending"
                },
                {
                    id: 2,
                    title: "Serie Drama Familiar",
                    type: "series",
                    category: "Drama",
                    submittedBy: "usuario2",
                    submittedAt: "2024-01-14T15:45:00Z",
                    description: "Una serie que explora las relaciones familiares...",
                    status: "pending"
                }
            ];
            
            setPendingContent(mockData);
        } catch (error) {
            handleApiError(error, 'No se pudo cargar el contenido pendiente');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (contentId, title) => {
        if (!validateTokenBeforeAction()) return;
        
        const result = await Swal.fire({
            title: 'Aprobar Contenido',
            text: `¿Aprobar "${title}" para publicación?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Aprobar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                // Aquí harías la llamada a la API para aprobar
                // await approveContent(contentId, authToken);
                
                await loadPendingContent();
                Swal.fire('Aprobado', 'Contenido aprobado correctamente', 'success');
            } catch (error) {
                handleApiError(error, 'No se pudo aprobar el contenido');
            }
        }
    };

    const handleReject = async (contentId, title) => {
        if (!validateTokenBeforeAction()) return;
        
        const { value: reason } = await Swal.fire({
            title: 'Rechazar Contenido',
            text: `¿Rechazar "${title}"?`,
            input: 'textarea',
            inputPlaceholder: 'Motivo del rechazo (opcional)...',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Rechazar',
            cancelButtonText: 'Cancelar'
        });

        if (reason !== undefined) {
            try {
                // Aquí harías la llamada a la API para rechazar
                // await rejectContent(contentId, reason, authToken);
                
                await loadPendingContent();
                Swal.fire('Rechazado', 'Contenido rechazado', 'success');
            } catch (error) {
                handleApiError(error, 'No se pudo rechazar el contenido');
            }
        }
    };

    const handleEdit = (contentId) => {
        // Abrir modal de edición o navegar a página de edición
        Swal.fire('Función en desarrollo', 'La edición de contenido estará disponible pronto', 'info');
    };

    const handleDelete = async (contentId, title) => {
        if (!validateTokenBeforeAction()) return;
        
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Se eliminará "${title}" permanentemente`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                // Aquí harías la llamada a la API para eliminar
                // await deleteContent(contentId, authToken);
                
                await loadPendingContent();
                Swal.fire('Eliminado', 'Contenido eliminado correctamente', 'success');
            } catch (error) {
                handleApiError(error, 'No se pudo eliminar el contenido');
            }
        }
    };

    const filteredContent = pendingContent.filter(content => {
        return selectedCategory === 'all' || content.category === selectedCategory;
    });

    if (loading) return <div className="text-center py-20">Cargando contenido pendiente...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Contenido Pendiente</h1>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Categoría</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todas las categorías</option>
                            <option value="Acción">Acción</option>
                            <option value="Drama">Drama</option>
                            <option value="Comedia">Comedia</option>
                            <option value="Ciencia Ficción">Ciencia Ficción</option>
                            <option value="Terror">Terror</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={loadPendingContent}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>

            {/* Lista de contenido */}
            <div className="space-y-4">
                {filteredContent.map((content) => (
                    <div key={content.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        content.type === 'movie' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {content.type === 'movie' ? 'Película' : 'Serie'}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                        {content.category}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">{content.description}</p>
                                <div className="text-sm text-gray-500">
                                    <span>Enviado por: <strong>{content.submittedBy}</strong></span>
                                    <span className="ml-4">
                                        {new Date(content.submittedAt).toLocaleDateString('es-ES')}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-4 lg:mt-0 lg:ml-4">
                                <button
                                    onClick={() => handleApprove(content.id, content.title)}
                                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                                >
                                    Aprobar
                                </button>
                                <button
                                    onClick={() => handleReject(content.id, content.title)}
                                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                                >
                                    Rechazar
                                </button>
                                <button
                                    onClick={() => handleEdit(content.id)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(content.id, content.title)}
                                    className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredContent.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <span className="text-6xl">📭</span>
                    </div>
                    <p className="text-gray-500">No hay contenido pendiente de revisión</p>
                </div>
            )}
        </div>
    );
};

export default PendingMedia;
