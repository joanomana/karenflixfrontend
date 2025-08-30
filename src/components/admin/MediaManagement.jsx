"use client";
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getAdminMedia, updateMediaAdmin, deleteMediaAdmin, createMediaAdmin } from '../../lib/api/media';
import EditMediaForm from './EditMediaForm';
import AddMediaForm from './AddMediaForm';

const MediaManagement = ({ authToken, currentUser, userId, validateTokenBeforeAction, handleApiError }) => {
    const [allMedia, setAllMedia] = useState([]);
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedSort, setSelectedSort] = useState('-createdAt');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [categories, setCategories] = useState(['Acción', 'Drama', 'Comedia', 'Ciencia Ficción', 'Terror', 'Romance', 'Thriller', 'Documental', 'Animación', 'Fantasía']);
    const [editingMedia, setEditingMedia] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        loadAllMedia();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, selectedCategory, selectedType, selectedSort, allMedia]);

    const loadAllMedia = async () => {
        if (!validateTokenBeforeAction()) return;

        try {
            setLoading(true);
            const response = await getAdminMedia(authToken);

            if (response && response.items) {
                setAllMedia(response.items);
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo cargar la media', 'error');
            setAllMedia([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        if (!allMedia.length) return;

        let filteredItems = [...allMedia];
        if (searchTerm.trim()) {
            filteredItems = filteredItems.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedCategory !== 'all') {
            filteredItems = filteredItems.filter(item =>
                item.category && item.category.name === selectedCategory
            );
        }

        if (selectedType !== 'all') {
            filteredItems = filteredItems.filter(item =>
                item.type === selectedType
            );
        }

        filteredItems.sort((a, b) => {
            switch (selectedSort) {
                case '-createdAt':
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                case 'createdAt':
                    return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
                case 'title':
                    return a.title.localeCompare(b.title);
                case '-title':
                    return b.title.localeCompare(a.title);
                case '-year':
                    return (b.year || 0) - (a.year || 0);
                case 'year':
                    return (a.year || 0) - (b.year || 0);
                case '-metrics.ratingAvg':
                    return (b.metrics?.ratingAvg || 0) - (a.metrics?.ratingAvg || 0);
                case 'metrics.ratingAvg':
                    return (a.metrics?.ratingAvg || 0) - (b.metrics?.ratingAvg || 0);
                default:
                    return 0;
            }
        });

        setMedia(filteredItems);
        setTotalItems(filteredItems.length);
    };

    const handleEdit = (mediaId) => {
        if (!validateTokenBeforeAction()) return;

        const mediaItem = allMedia.find(item => item._id === mediaId);

        if (mediaItem) {
            setEditingMedia(mediaItem);
            setShowEditModal(true);
        } else {
            Swal.fire('Error', 'No se encontró la información del contenido', 'error');
        }
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
                await deleteMediaAdmin(mediaId, authToken);

                const updatedAllMedia = allMedia.filter(item => item._id !== mediaId);
                setAllMedia(updatedAllMedia);

                Swal.fire('Eliminado', 'Contenido eliminado correctamente', 'success');
            } catch (error) {
                handleApiError(error, 'No se pudo eliminar el contenido');
            }
        }
    };

    const handleSaveEdit = async (updatedData) => {
        if (!validateTokenBeforeAction()) return;

        try {
            await updateMediaAdmin(editingMedia._id, updatedData, authToken);

            // Actualizar el estado local sin recargar desde backend
            // Convertir category string a objeto si es necesario
            const processedData = {
                ...updatedData,
                category: typeof updatedData.category === 'string'
                    ? { name: updatedData.category }
                    : updatedData.category
            };

            const updatedAllMedia = allMedia.map(item =>
                item._id === editingMedia._id
                    ? { ...item, ...processedData }
                    : item
            );
            setAllMedia(updatedAllMedia);

            setShowEditModal(false);
            setEditingMedia(null);
            Swal.fire('Actualizado', 'Contenido actualizado correctamente', 'success');
        } catch (error) {
            console.error('Error updating media:', error);
            handleApiError(error, 'No se pudo actualizar el contenido');
        }
    };

    const handleAddNew = () => {
        setShowAddModal(true);
    };

    const handleSaveNew = async (newData) => {
        if (!validateTokenBeforeAction()) return;

        try {
            await createMediaAdmin(newData, authToken);

            // Recargar toda la media desde el backend para asegurar sincronización
            await loadAllMedia();

            setShowAddModal(false);
            Swal.fire('Creado', 'Contenido creado correctamente', 'success');
        } catch (error) {
            console.error('Error creating media:', error);
            handleApiError(error, 'No se pudo crear el contenido');
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    if (loading) return (
        <div className="text-center py-20">
            <div>Cargando contenido multimedia...</div>
            <div className="text-sm text-gray-500 mt-2">
                Debug: loading={loading ? 'true' : 'false'},
                mediaCount={media.length},
                page={currentPage}
            </div>
        </div>
    );

    return (
        <div className="w-full mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Media</h1>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={handleAddNew}
                >
                    + Agregar Contenido
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                            <option value="anime">Anime</option>
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
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                        <select
                            value={selectedSort}
                            onChange={(e) => setSelectedSort(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="-createdAt">Más recientes</option>
                            <option value="createdAt">Más antiguos</option>
                            <option value="title">Título A-Z</option>
                            <option value="-title">Título Z-A</option>
                            <option value="-year">Año (nuevo-viejo)</option>
                            <option value="year">Año (viejo-nuevo)</option>
                            <option value="-metrics.ratingAvg">Mejor calificados</option>
                            <option value="metrics.ratingAvg">Peor calificados</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                                setSelectedType('all');
                                setSelectedSort('-createdAt');
                            }}
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-6 gap-6">
                {media.map((item, index) => (
                    <div key={item._id || `media-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="aspect-video bg-gray-200 flex items-center justify-center">
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-4xl">
                                    {item.type === 'movie' ? '🎬' : item.type === 'series' ? '📺' : '🎭'}
                                </span>
                            )}
                        </div>

                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {item.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="text-sm text-gray-600 space-y-1 mb-3">
                                <div className="flex justify-between">
                                    <span>Tipo:</span>
                                    <span>{item.type === 'movie' ? 'Película' : item.type === 'series' ? 'Serie' : 'Anime'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Categoría:</span>
                                    <span>{item.category.name || 'Sin categoría'}</span>
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
                                    <span>⭐ {item.metrics?.ratingAvg?.toFixed(1) || 'N/A'} ({item.metrics?.ratingCount || 0})</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Score:</span>
                                    <span>{item.metrics?.weightedScore?.toFixed(2) || '0.00'}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleEdit(item._id)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id, item.title)}
                                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {media.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <span className="text-6xl">🎭</span>
                    </div>
                    <p className="text-gray-500">No se encontró contenido que coincida con los filtros</p>
                </div>
            )}


            {media.length > 0 && (
                <div className="flex justify-center mt-6">
                    <p className="text-gray-600">
                        Mostrando todos los {totalItems} elementos de media
                    </p>
                </div>
            )}


            {showEditModal && editingMedia && (
                <EditMediaForm
                    mediaItem={editingMedia}
                    onSave={handleSaveEdit}
                    onCancel={() => {
                        setShowEditModal(false);
                        setEditingMedia(null);
                    }}
                    authToken={authToken}
                    validateTokenBeforeAction={validateTokenBeforeAction}
                    handleApiError={handleApiError}
                />
            )}

            <AddMediaForm
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleSaveNew}
            />
        </div>
    );
};

export default MediaManagement;
