import React from 'react';
import Link from 'next/link';

export default function MovieSlider({ movies }) {
    return (
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {movies.map(movie => (
                <div key={movie.slug || movie.id} className="flex-shrink-0">
                    {/* MovieCard wrapped in Link */}
                    <Link href={`/media/${encodeURIComponent(movie.slug || movie.id)}`}>
                    <div className="bg-white rounded-xl shadow hover:scale-105 transition-transform duration-200 overflow-hidden w-48">
                        <img src={(movie.image || movie.imageUrl || '/window.svg')} alt={movie.title} className="w-full h-64 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">{movie.rating}</span>
                                <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs">{movie.year}</span>
                                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">{movie.percentage}%</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{movie.genre}</p>
                            <p className="text-xs text-gray-500">{movie.description}</p>
                        </div>
                    </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
