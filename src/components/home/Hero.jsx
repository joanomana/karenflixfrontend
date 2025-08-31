'use client';

import React, { useState, useEffect } from 'react';
import { getPopular } from '../../lib/api/media';
import { useRouter } from 'next/navigation';

export default function Hero() {
    const [mediaList, setMediaList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const response = await getPopular({ limit: 5 });
                if (response.items && response.items.length > 0) {
                    setMediaList(response.items);
                }
            } catch (error) {
                console.error('Error fetching media:', error);
                // Fallback data in case of error
                setMediaList([{
                    _id: 'fallback',
                    title: 'John Wick 3: Parabellum',
                    description: 'John Wick is on the run after killing a member of the international assassin\'s guild, and with a $14 million price tag on his head, he is the target of hit men and women everywhere.',
                    imageUrl: '/johnwick.jpg',
                    metrics: { weightedScore: 8.6, audienceScore: 97 },
                    slug: 'john-wick-3-parabellum'
                }]);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, []);

    // Auto-advance carousel
    useEffect(() => {
        if (mediaList.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % mediaList.length);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [mediaList.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
    };

    const handleViewMedia = (media) => {
        const idOrSlug = media.slug || media._id;
        router.push(`/media/${idOrSlug}`);
    };

    if (loading) {
        return (
            <section className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-black">
                <div className="text-white text-xl">Cargando...</div>
            </section>
        );
    }

    if (mediaList.length === 0) {
        return (
            <section className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-black">
                <div className="text-white text-xl">No hay contenido disponible</div>
            </section>
        );
    }

    const currentMedia = mediaList[currentIndex];
    const imageUrl = currentMedia.imageUrl || currentMedia.posterUrl || '/johnwick.jpg';
    const title = currentMedia.title || currentMedia.name || 'Sin título';
    const type = currentMedia.type || 'Sin tipo disponible';
    const score = currentMedia.metrics?.weightedScore || currentMedia.rating || 0;
    const audienceScore = currentMedia.metrics?.audienceScore || currentMedia.audienceRating || 0;

    return (
        <section className="relative h-[600px] md:h-[500px] w-full flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-black overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img 
                    src={imageUrl} 
                    alt={title}
                    className="w-full h-full object-cover opacity-60 transition-opacity duration-1000"
                    onError={(e) => {
                        e.target.src = '/johnwick.jpg';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
                {/* Mobile Layout */}
                <div className="flex flex-col md:hidden items-center text-center text-white space-y-4">
                    <div className="w-48 h-64 mb-4">
                        <img 
                            src={imageUrl} 
                            alt={title} 
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                            onError={(e) => {
                                e.target.src = '/johnwick.jpg';
                            }}
                        />
                    </div>
                    
                    <h1 className="text-2xl font-bold drop-shadow-lg px-4">
                        {title}
                    </h1>
                    
                    {/* Rating */}
                    <div className="flex items-center justify-center gap-3">
                        {score > 0 && (
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                                {(score * 10).toFixed(0)}/100
                            </span>
                        )}
                        {audienceScore > 0 && (
                            <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                                {audienceScore}%
                            </span>
                        )}
                    </div>

                    {/* Type */}
                    <p className="text-sm text-gray-300 px-4">
                        {type}
                    </p>

                    {/* Action Button */}
                    <button 
                        onClick={() => handleViewMedia(currentMedia)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 text-sm"
                    >
                        VER DETALLES
                    </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex gap-8 lg:gap-20 items-center text-white">
                    <div className="flex-shrink-0">
                        <img 
                            src={imageUrl} 
                            alt={title} 
                            className="rounded-lg shadow-lg w-64 h-80 object-cover"
                            onError={(e) => {
                                e.target.src = '/johnwick.jpg';
                            }}
                        />
                    </div>
                    
                    <div className="flex-1 max-w-2xl">
                        <h1 className="text-3xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                            {title}
                        </h1>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-4 mb-4">
                            {score > 0 && (
                                <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold">
                                    {(score * 10).toFixed(0)}/100
                                </span>
                            )}
                            {audienceScore > 0 && (
                                <span className="bg-gray-700 px-3 py-1 rounded">
                                    {audienceScore}%
                                </span>
                            )}
                        </div>

                        {/* Type */}
                        <p className="mb-6 text-lg leading-relaxed drop-shadow">
                            {type}
                        </p>

                        {/* Action Button */}
                        <button 
                            onClick={() => handleViewMedia(currentMedia)}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            VER DETALLES
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {mediaList.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full transition-all duration-300"
                    >
                        <svg width="20" height="20" className="md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="15,18 9,12 15,6" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full transition-all duration-300"
                    >
                        <svg width="20" height="20" className="md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="9,6 15,12 9,18" />
                        </svg>
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {mediaList.length > 1 && (
                <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                    {mediaList.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                                index === currentIndex 
                                    ? 'bg-white scale-110' 
                                    : 'bg-white/50 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
