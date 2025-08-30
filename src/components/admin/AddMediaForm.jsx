import { useState } from 'react';
import Swal from 'sweetalert2';

export default function AddMediaForm({ isOpen, onClose, onSave }) {
    const [categories] = useState([
        'Acción',
        'Drama',
        'Comedia',
        'Ciencia Ficción',
        'Terror',
        'Romance',
        'Thriller',
        'Documental',
        'Animación',
        'Fantasía'
    ]);
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        description: '',
        category: '',
        year: '',
        imageUrl: '',
        status: 'approved' // Admin crea contenido aprobado directamente
    });

    const [imagePreview, setImagePreview] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));


        if (name === 'imageUrl') {
            setImagePreview(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!formData.title || !formData.type || !formData.description || !formData.category) {
            Swal.fire('Error', 'Por favor completa todos los campos requeridos (título, tipo, descripción, categoría)', 'error');
            return;
        }

        try {

            const dataToSend = {
                ...formData,
                category: {
                    name: formData.category
                }
            };

            await onSave(dataToSend);
            handleClose();
        } catch (error) {
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            type: '',
            description: '',
            category: '',
            year: '',
            imageUrl: '',
            status: 'approved'
        });
        setImagePreview('');
        onClose();
    };

    const handleImageError = () => {
        setImagePreview('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Agregar Nuevo Contenido</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Formulario - Lado Izquierdo */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Contenido</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ingresa el título del contenido"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Contenido *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Selecciona el tipo</option>
                                    <option value="movie">Película</option>
                                    <option value="series">Serie</option>
                                    <option value="anime">Anime</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe el contenido"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoría *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL de Imagen *
                                </label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Año
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="2024"
                                    min="1900"
                                    max="2030"
                                />
                            </div>
                        </div>

                        {/* Previsualización - Lado Derecho */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Previsualización</h3>

                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <h4 className="text-md font-medium text-gray-800 mb-3">Cómo se verá la tarjeta:</h4>

                                {/* Card Preview */}
                                <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm mx-auto">
                                    <div className="relative aspect-[3/4] bg-gray-200">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={handleImageError}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <div className="text-center">
                                                    <div className="text-4xl mb-2">🖼️</div>
                                                    <div className="text-sm">Vista previa de imagen</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h5 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
                                            {formData.title || 'Título del contenido'}
                                        </h5>

                                        <div className="flex items-center gap-2 mb-2">
                                            {formData.type && (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                    {formData.type === 'movie' ? 'Película' : formData.type === 'series' ? 'Serie' : 'Anime'}
                                                </span>
                                            )}
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                {formData.category || 'Categoría'}
                                            </span>
                                            {formData.year && (
                                                <span className="text-gray-500 text-sm">
                                                    {formData.year}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 text-sm line-clamp-3">
                                            {formData.description || 'Descripción del contenido aparecerá aquí...'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Información adicional */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="text-md font-medium text-blue-800 mb-2">Información del contenido:</h4>
                                <div className="text-sm text-blue-700 space-y-1">
                                    <div><strong>Título:</strong> {formData.title || 'Sin título'}</div>
                                    <div><strong>Tipo:</strong> {formData.type ? (formData.type === 'movie' ? 'Película' : formData.type === 'series' ? 'Serie' : 'Anime') : 'Sin tipo'}</div>
                                    <div><strong>Categoría:</strong> {formData.category || 'Sin categoría'}</div>
                                    <div><strong>Año:</strong> {formData.year || 'No especificado'}</div>
                                    <div><strong>¿Tiene imagen?:</strong> {formData.imageUrl ? '✅ Sí' : '❌ No'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Guardar Contenido
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
