"use client";
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const MediaManagement = ({ authToken, currentUser, userId, validateTokenBeforeAction, handleApiError }) => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

    useEffect(() => {
        loadMedia();
    }, []);

    const loadMedia = async () => {
        if (!validateTokenBeforeAction()) return;
        
        try {
            setLoading(true);
            // Aquí harías la llamada a la API para obtener todas las medias
            // const authToken = token || localStorage.getItem('jwt');
            // const data = await getAllMedia(authToken);
            
            // Datos de ejemplo mientras no tengamos la API
            const mockData = [
                {
                    id: 1,
                    title: "Avatar: El Camino del Agua",
                    type: "movie",
                    category: "Ciencia Ficción",
                    year: 2022,
                    duration: "192 min",
                    rating: 8.1,
                    status: "published",
                    views: 15420,
                    createdAt: "2023-01-15T10:30:00Z"
                },
                {
                    id: 2,
                    title: "Stranger Things",
                    type: "series",
                    category: "Ciencia Ficción",
                    year: 2016,
                    seasons: 4,
                    rating: 8.7,
                    status: "published",
                    views: 28350,
                    createdAt: "2023-02-20T14:15:00Z"
                },
                {
                    id: 3,
                    title: "John Wick 4",
                    type: "movie",
                    category: "Acción",
                    year: 2023,
                    duration: "169 min",
                    rating: 8.3,
                    status: "published",
                    views: 12890,
                    createdAt: "2023-03-10T16:45:00Z"
                }
            ];
            
            setMedia(mockData);
        } catch (error) {
            handleApiError(error, 'No se pudo cargar el contenido multimedia');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (mediaId, title) => {
        // Aquí podrías abrir un modal de edición o navegar a una página de edición
        Swal.fire({
            title: 'Editar Contenido',
            text: `Función de edición para "${title}" estará disponible pronto`,
            icon: 'info'
        });
    };

    const handleDelete = async (mediaId, title) => {
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
                // await deleteMedia(mediaId, authToken);
                
                setMedia(media.filter(item => item.id !== mediaId));
                Swal.fire('Eliminado', 'Contenido eliminado correctamente', 'success');
            } catch (error) {
                handleApiError(error, 'No se pudo eliminar el contenido');
            }
        }
    };

    const handleChangeStatus = async (mediaId, currentStatus, title) => {
        if (!validateTokenBeforeAction()) return;
        
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        const actionText = newStatus === 'published' ? 'publicar' : 'despublicar';
        
        const result = await Swal.fire({
            title: 'Cambiar Estado',
            text: `¿${actionText.charAt(0).toUpperCase() + actionText.slice(1)} "${title}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: actionText.charAt(0).toUpperCase() + actionText.slice(1),
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                // Aquí harías la llamada a la API para cambiar el estado
                // await updateMediaStatus(mediaId, newStatus, authToken);
                
                setMedia(media.map(item => 
                    item.id === mediaId ? { ...item, status: newStatus } : item
                ));
                Swal.fire('Actualizado', `Contenido ${newStatus === 'published' ? 'publicado' : 'despublicado'} correctamente`, 'success');
            } catch (error) {
                handleApiError(error, 'No se pudo cambiar el estado');
            }
        }
    };

    const filteredMedia = media.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesType = selectedType === 'all' || item.type === selectedType;
        return matchesSearch && matchesCategory && matchesType;
    });

    if (loading) return <div className="text-center py-20">Cargando contenido multimedia...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Media</h1>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={() => Swal.fire('Función en desarrollo', 'La creación de contenido estará disponible pronto', 'info')}
                >
                    + Agregar Contenido
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                        <input
                            type="text"
                            placeholder="Buscar por título..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todos</option>
                            <option value="movie">Películas</option>
                            <option value="series">Series</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todas</option>
                            <option value="Acción">Acción</option>
                            <option value="Drama">Drama</option>
                            <option value="Comedia">Comedia</option>
                            <option value="Ciencia Ficción">Ciencia Ficción</option>
                            <option value="Terror">Terror</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid de contenido */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedia.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="aspect-video bg-gray-200 flex items-center justify-center">
                            <span className="text-4xl">
                                {item.type === 'movie' ? '🎬' : '📺'}
                            </span>
                        </div>
                        
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.status === 'published' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {item.status === 'published' ? 'Publicado' : 'Borrador'}
                                </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 space-y-1 mb-3">
                                <div className="flex justify-between">
                                    <span>Tipo:</span>
                                    <span>{item.type === 'movie' ? 'Película' : 'Serie'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Categoría:</span>
                                    <span>{item.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Año:</span>
                                    <span>{item.year}</span>
                                </div>
                                {item.duration && (
                                    <div className="flex justify-between">
                                        <span>Duración:</span>
                                        <span>{item.duration}</span>
                                    </div>
                                )}
                                {item.seasons && (
                                    <div className="flex justify-between">
                                        <span>Temporadas:</span>
                                        <span>{item.seasons}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Rating:</span>
                                    <span>⭐ {item.rating}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Vistas:</span>
                                    <span>{item.views.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleEdit(item.id, item.title)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleChangeStatus(item.id, item.status, item.title)}
                                    className={`px-3 py-1 text-white rounded text-sm transition-colors ${
                                        item.status === 'published'
                                            ? 'bg-yellow-600 hover:bg-yellow-700'
                                            : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                >
                                    {item.status === 'published' ? 'Despublicar' : 'Publicar'}
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id, item.title)}
                                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredMedia.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <span className="text-6xl">🎭</span>
                    </div>
                    <p className="text-gray-500">No se encontró contenido que coincida con los filtros</p>
                </div>
            )}
        </div>
    );
};

export default MediaManagement;
