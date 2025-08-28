import React from 'react';
import MovieSlider from './MovieSlider';

export default function MovieSection({ title, movies }) {
    return (
        <section className="my-10 px-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{title}</h2>
                <a href="#" className="text-red-600 font-semibold hover:underline">See more &rarr;</a>
            </div>
            <MovieSlider movies={movies} />
        </section>
    );
}
