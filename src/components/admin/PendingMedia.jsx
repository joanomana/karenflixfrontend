"use client";
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getPendingMedia, updateMediaStatus, deleteMediaAdmin, getMediaByIdAdmin, updateMediaAdmin } from '../../lib/api/media';
import { auth } from '@/lib/api';

const PendingMedia = ({ authToken, currentUser, userId, validateTokenBeforeAction, handleApiError }) => {
    const [pendingContent, setPendingContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState(['Acción', 'Drama', 'Comedia', 'Ciencia Ficción', 'Terror', 'Romance', 'Thriller', 'Documental', 'Animación', 'Fantasía']);
    const [editingMedia, setEditingMedia] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        loadPendingContent();
    }, []);

    const loadPendingContent = async () => {
        if (!validateTokenBeforeAction()) return;

        try {
            setLoading(true);
            const params = {};
            if (selectedCategory !== 'all') {
                params.category = selectedCategory;
            }

            const response = await getPendingMedia(params, authToken);
            setPendingContent(response.items);
        } catch (error) {
            console.error('Error loading pending content:', error);
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
                await updateMediaStatus(contentId, 'approved', authToken);
                await loadPendingContent();
                Swal.fire('Aprobado', 'Contenido aprobado correctamente', 'success');
            } catch (error) {
                console.error('Error approving content:', error);
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
                await updateMediaStatus(contentId, 'rejected', authToken, reason);
                await loadPendingContent();
                Swal.fire('Rechazado', 'Contenido rechazado', 'success');
            } catch (error) {
                console.error('Error rejecting content:', error);
                handleApiError(error, 'No se pudo rechazar el contenido');
            }
        }
    };

    const handleEdit = (contentId) => {
        if (!validateTokenBeforeAction()) return;

        // Usar datos locales en lugar de hacer petición al backend
        const mediaToEdit = pendingContent.find(item => item._id === contentId);
        if (mediaToEdit) {
            setEditingMedia(mediaToEdit);
            setShowEditModal(true);
        } else {
            Swal.fire('Error', 'No se pudo encontrar el contenido a editar', 'error');
        }
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
                await deleteMediaAdmin(contentId, authToken);
                await loadPendingContent();
                Swal.fire('Eliminado', 'Contenido eliminado correctamente', 'success');
            } catch (error) {
                console.error('Error deleting content:', error);
                handleApiError(error, 'No se pudo eliminar el contenido');
            }
        }
    };

    const handleSaveEdit = async (updatedData) => {
        if (!validateTokenBeforeAction()) return;

        try {
            await updateMediaAdmin(editingMedia._id, updatedData, authToken);
            setShowEditModal(false);
            setEditingMedia(null);
            await loadPendingContent();
            Swal.fire('Actualizado', 'Contenido actualizado correctamente', 'success');
        } catch (error) {
            console.error('Error updating media:', error);
            handleApiError(error, 'No se pudo actualizar el contenido');
        }
    };

    // Refrescar cuando cambie el filtro de categoría
    useEffect(() => {
        if (!loading) {
            loadPendingContent();
        }
    }, [selectedCategory]);

    if (loading) return <div className="text-center py-20">Cargando contenido pendiente...</div>;

    return (
        <div className="w-full mx-auto">
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
                            {categories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
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

            {/* Lista de contenido en formato de tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingContent.map((content, index) => (
                    <div key={content._id || `pending-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="aspect-video bg-gray-200 flex items-center justify-center">
                            {content.imageUrl ? (
                                <img
                                    src={content.imageUrl}
                                    alt={content.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-4xl">🎬</span>
                            )}
                        </div>

                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg">{content.title}</h3>
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                    PENDING
                                </span>
                            </div>

                            <div className="text-sm text-gray-600 space-y-1 mb-3">
                                <div className="flex justify-between">
                                    <span>Tipo:</span>
                                    <span>{content.type === 'movie' ? 'Película' : content.type === 'series' ? 'Serie' : 'Anime'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Categoría:</span>
                                    <span>{content.category?.name || 'Sin categoría'}</span>
                                </div>
                                {content.year && (
                                    <div className="flex justify-between">
                                        <span>Año:</span>
                                        <span>{content.year}</span>
                                    </div>
                                )}
                                {content.duration && (
                                    <div className="flex justify-between">
                                        <span>Duración:</span>
                                        <span>{content.duration} min</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{content.description}</p>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleApprove(content._id, content.title)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                >
                                    ✓ Aprobar
                                </button>
                                <button
                                    onClick={() => handleReject(content._id, content.title)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                >
                                    ✗ Rechazar
                                </button>
                                <button
                                    onClick={() => handleEdit(content._id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                >
                                    ✏️ Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(content._id, content.title)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {pendingContent.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <span className="text-6xl">📭</span>
                    </div>
                    <p className="text-gray-500">No hay contenido pendiente de revisión</p>
                </div>
            )}

            {/* Modal de edición */}
            {showEditModal && editingMedia && (
                <EditMediaModal
                    media={editingMedia}
                    categories={categories}
                    onSave={handleSaveEdit}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingMedia(null);
                    }}
                />
            )}
        </div>
    );
};

// Componente Modal para edición
const EditMediaModal = ({ media, categories, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        title: media.title || '',
        description: media.description || '',
        type: media.type || 'movie',
        category: media.category?.name || '',
        year: media.year || new Date().getFullYear(),
        imageurl: media.imageUrl || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Preparar los datos para el backend
        const dataToSend = {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            category: { name: formData.category },
            year: parseInt(formData.year),
            imageurl: formData.imageurl
        };

        onSave(dataToSend);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Editar Contenido</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="flex p-6">
                    {/* Formulario */}
                    <div className="flex-1 pr-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="movie">Película</option>
                                    <option value="series">Serie</option>
                                    <option value="anime">Anime</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="1900"
                                    max="2030"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">URL de la Imagen *</label>
                                <input
                                    type="url"
                                    name="imageurl"
                                    value={formData.imageurl}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Vista previa */}
                    <div className="flex-1 pl-6 border-l">
                        <h3 className="text-lg font-semibold mb-4">Vista Previa</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            {formData.imageurl && (
                                <div className="mb-4">
                                    <img
                                        src={formData.imageurl}
                                        alt={formData.title}
                                        className="w-full h-48 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-image.png';
                                        }}
                                    />
                                </div>
                            )}
                            <h4 className="font-bold text-lg text-gray-800">{formData.title || 'Título del contenido'}</h4>
                            <p className="text-sm text-gray-600 mb-2">
                                {formData.type === 'movie' ? 'Película' : formData.type === 'series' ? 'Serie' : 'Anime'} • {formData.year} • {formData.category || 'Sin categoría'}
                            </p>
                            <p className="text-gray-700 text-sm">{formData.description || 'Sin descripción'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingMedia;
