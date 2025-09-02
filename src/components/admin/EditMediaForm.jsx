'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const EditMediaForm = ({ mediaItem, onSave, onCancel, authToken, validateTokenBeforeAction, handleApiError }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        year: '',
        type: 'movie',
        category: '',
        imageUrl: '',
        status: ''
    });

    useEffect(() => {
        if (mediaItem) {
            ``
            setFormData({
                title: mediaItem.title || '',
                description: mediaItem.description || '',
                year: mediaItem.year || '',
                type: mediaItem.type || 'movie',
                category: mediaItem.category.name || '',
                imageUrl: mediaItem.imageUrl,
                status: mediaItem.status || 'pending'
            });
        }
    }, [mediaItem]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateTokenBeforeAction()) return;

        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error saving media:', error);
            handleApiError(error, 'No se pudo guardar los cambios');
        }
    };

    if (!mediaItem) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Editar Media</h2>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                📋 Información Actual
                            </h3>

                            <div className="space-y-4">
                                {/* Imagen anterior */}
                                <div className="text-center">
                                    {mediaItem.imageUrl ? (
                                        <img
                                            src={mediaItem.imageUrl}
                                            alt={mediaItem.title}
                                            className="w-32 h-48 object-cover rounded-lg mx-auto shadow-md"
                                        />
                                    ) : (
                                        <div className="w-32 h-48 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                                            <span className="text-4xl">
                                                {mediaItem.type === 'movie' ? '🎬' : mediaItem.type === 'series' ? '📺' : '🎭'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Datos anteriores */}
                                <div className="space-y-2 text-sm">
                                    <div><strong>Título:</strong> {mediaItem.title}</div>
                                    <div><strong>Tipo:</strong> {mediaItem.type === 'movie' ? 'Película' : mediaItem.type === 'series' ? 'Serie' : 'Anime'}</div>
                                    <div><strong>Año:</strong> {mediaItem.year}</div>
                                    <div><strong>Categoría:</strong> {mediaItem.category?.name || 'Sin categoría'}</div>
                                    <div><strong>Estado:</strong>
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${mediaItem.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                mediaItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {mediaItem.status.toUpperCase()}
                                        </span>
                                    </div>
                                    {mediaItem.description && (
                                        <div><strong>Descripción:</strong> {mediaItem.description.substring(0, 100)}...</div>
                                    )}
                                    {mediaItem.duration && (
                                        <div><strong>Duración:</strong> {mediaItem.duration}</div>
                                    )}
                                    {mediaItem.seasons && (
                                        <div><strong>Temporadas:</strong> {mediaItem.seasons}</div>
                                    )}
                                    <div><strong>Rating:</strong> ⭐ {mediaItem.metrics?.ratingAvg?.toFixed(1) || 'N/A'} ({mediaItem.metrics?.ratingCount || 0} votos)</div>
                                </div>
                            </div>
                        </div>

                        {/* Formulario de Edición (Derecha) */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                ✏️ Nueva Información
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Descripción del contenido..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="movie">Película</option>
                                            <option value="series">Serie</option>
                                            <option value="anime">Anime</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                                        <input
                                            type="number"
                                            name="year"
                                            value={formData.year}
                                            onChange={handleInputChange}
                                            min="1900"
                                            max="2030"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        <option value="Acción">Acción</option>
                                        <option value="Drama">Drama</option>
                                        <option value="Comedia">Comedia</option>
                                        <option value="Ciencia Ficción">Ciencia Ficción</option>
                                        <option value="Terror">Terror</option>
                                        <option value="Romance">Romance</option>
                                        <option value="Thriller">Thriller</option>
                                        <option value="Documental">Documental</option>
                                        <option value="Animación">Animación</option>
                                        <option value="Fantasía">Fantasía</option>
                                        <option value="Aventura">Aventura</option>
                                        <option value="Superhéroes">Superhéroes</option>
                                        <option value="Anime">Anime</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
                                    {formData.imageUrl && (
                                        <div className="mt-2">
                                            <img
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className="w-20 h-30 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Campos condicionales */}
                                {formData.type === 'movie' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            placeholder="120 min"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                                {formData.type === 'series' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Temporadas</label>
                                        <input
                                            type="number"
                                            name="seasons"
                                            value={formData.seasons}
                                            onChange={handleInputChange}
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="pending">Pendiente</option>
                                        <option value="approved">Aprobado</option>
                                        <option value="rejected">Rechazado</option>
                                    </select>
                                </div>

                                {/* Botones */}
                                <div className="flex justify-end space-x-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={onCancel}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditMediaForm;
