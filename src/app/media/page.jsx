'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPublicMedia } from '../../lib/api/media';

// Componente MediaCard
function MediaCard({ media }) {
    const router = useRouter();

    const handleClick = () => {
        const idOrSlug = media.slug || media._id;
        router.push(`/media/${idOrSlug}`);
    };

    const imageUrl = media.imageUrl || media.posterUrl || '/johnwick.jpg';
    const title = media.title || media.name || 'Sin título';
    const score = media.metrics?.weightedScore || media.rating || 0;
    const audienceScore = media.metrics?.audienceScore || media.audienceRating || 0;

    return (
        <div 
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200"
            onClick={handleClick}
        >
            <div className="relative aspect-[2/3] w-full">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = '/johnwick.jpg';
                    }}
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded px-2 py-1">
                    <span className="text-yellow-400 text-sm font-bold">
                        {score > 0 ? (score * 10).toFixed(0) : 'N/A'}
                    </span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-gray-900 font-semibold mb-2 line-clamp-2">{title}</h3>
                <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm capitalize">{media.type || 'Media'}</span>
                    {audienceScore > 0 && (
                        <span className="text-green-600 text-sm">{audienceScore}%</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MediaPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Estados
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    
    // Filtros
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || '');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Tipos disponibles
    const mediaTypes = [
        { value: '', label: 'Todos los tipos' },
        { value: 'movie', label: 'Películas' },
        { value: 'series', label: 'Series' },
        { value: 'anime', label: 'Anime' }
    ];

    // Categorías predefinidas (del panel admin)
    const mediaCategories = [
        { value: '', label: 'Todas las categorías' },
        { value: 'Acción', label: 'Acción' },
        { value: 'Drama', label: 'Drama' },
        { value: 'Comedia', label: 'Comedia' },
        { value: 'Ciencia Ficción', label: 'Ciencia Ficción' },
        { value: 'Terror', label: 'Terror' },
        { value: 'Romance', label: 'Romance' },
        { value: 'Thriller', label: 'Thriller' },
        { value: 'Documental', label: 'Documental' },
        { value: 'Animación', label: 'Animación' },
        { value: 'Fantasía', label: 'Fantasía' }
    ];

    // Opciones de ordenamiento (del panel admin)
    const sortOptions = [
        { value: '', label: 'Sin ordenar' },
        { value: '-year', label: 'Año (nuevo-viejo)' },
        { value: 'year', label: 'Año (viejo-nuevo)' },
        { value: '-metrics.ratingAvg', label: 'Mejor calificados' },
        { value: 'metrics.ratingAvg', label: 'Peor calificados' }
    ];

    // Cargar media
    useEffect(() => {
        const fetchMedia = async () => {
            setLoading(true);
            try {
                const params = {
                    page: currentPage,
                    limit: 20,
                    status: 'approved' // Solo media aprobada
                };

                if (searchQuery.trim()) params.q = searchQuery.trim();
                if (selectedType) params.type = selectedType;
                // Removemos category del params ya que la API pública no lo soporta
                // if (selectedCategory) params.category = selectedCategory;
                if (selectedSort) params.sort = selectedSort;

                const response = await getPublicMedia(params);
                
                if (response?.data || response?.items) {
                    let mediaData = response.data || response.items || [];
                    
                    // Filtrar por categoría del lado del cliente
                    if (selectedCategory) {
                        mediaData = mediaData.filter(item => 
                            item.category?.name === selectedCategory
                        );
                    }
                    
                    if (currentPage === 1) {
                        setMedia(mediaData);
                    } else {
                        setMedia(prev => [...prev, ...mediaData]);
                    }
                    
                    // Verificar si hay más páginas
                    setHasMore(mediaData.length === params.limit);
                } else {
                    if (currentPage === 1) {
                        setMedia([]);
                    }
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error fetching media:', error);
                if (currentPage === 1) {
                    setMedia([]);
                }
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, [searchQuery, selectedType, selectedCategory, selectedSort, currentPage]);

    // Manejar cambios en filtros
    const handleFilterChange = () => {
        setCurrentPage(1);
        setMedia([]);
        
        // Actualizar URL (sin categoría ya que se filtra del lado del cliente)
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('q', searchQuery.trim());
        if (selectedType) params.set('type', selectedType);
        // No incluimos category en la URL ya que se filtra del lado del cliente
        if (selectedSort) params.set('sort', selectedSort);
        
        const newUrl = params.toString() ? `/media?${params.toString()}` : '/media';
        window.history.replaceState({}, '', newUrl);
    };

    // Búsqueda
    const handleSearch = (e) => {
        e.preventDefault();
        handleFilterChange();
    };

    // Cargar más
    const loadMore = () => {
        if (!loading && hasMore) {
            setCurrentPage(prev => prev + 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    {/* Botón Volver a Inicio */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Volver a inicio
                        </button>
                    </div>
                    
                    <h1 className="text-4xl font-bold mb-4 text-gray-900">Explorar Media</h1>
                    <p className="text-gray-600">Descubre películas, series y anime</p>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-lg p-6 mb-8 shadow-lg border border-gray-200">
                    <div className="space-y-4">
                        {/* Búsqueda */}
                        <div className="w-full">
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    placeholder="Buscar por título..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:bg-white"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors whitespace-nowrap"
                                >
                                    Buscar
                                </button>
                            </form>
                        </div>

                        {/* Filtros en grid responsive */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Filtro por tipo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => {
                                        setSelectedType(e.target.value);
                                        handleFilterChange();
                                    }}
                                    className="w-full px-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:bg-white"
                                >
                                    {mediaTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtro por categoría */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        handleFilterChange();
                                    }}
                                    className="w-full px-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:bg-white"
                                >
                                    {mediaCategories.map(category => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtro por ordenamiento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                                <select
                                    value={selectedSort}
                                    onChange={(e) => {
                                        setSelectedSort(e.target.value);
                                        handleFilterChange();
                                    }}
                                    className="w-full px-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:bg-white"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Limpiar filtros */}
                    <div className="mt-4">
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedType('');
                                setSelectedCategory('');
                                setSelectedSort('');
                                handleFilterChange();
                            }}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm border border-gray-300"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>

                {/* Resultados */}
                {loading && currentPage === 1 ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-xl text-gray-600">Cargando...</div>
                    </div>
                ) : media.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-xl text-gray-600 mb-4">No se encontró contenido</div>
                        <p className="text-gray-500">Intenta con otros filtros de búsqueda</p>
                    </div>
                ) : (
                    <>
                        {/* Grid de media */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
                            {media.map((item) => (
                                <MediaCard key={item._id} media={item} />
                            ))}
                        </div>

                        {/* Botón cargar más */}
                        {hasMore && (
                            <div className="flex justify-center">
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                                >
                                    {loading ? 'Cargando...' : 'Cargar más'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
