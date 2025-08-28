import React from 'react';

export default function Hero() {
    return (
        <section className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-black">
            <img src="/johnwick.jpg" alt="John Wick 3" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div className="relative z-10 max-w-2xl text-white p-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">John Wick 3 : Parabellum</h1>
                <div className="flex items-center gap-4 mb-2">
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded font-bold">860/100</span>
                    <span className="bg-gray-700 px-2 py-1 rounded">97%</span>
                </div>
                <p className="mb-6 text-lg">John Wick is on the run after killing a member of the international assassin’s guild, and with a $14 million price tag on his head, he is the target of hit men and women everywhere.</p>
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold shadow">WATCH TRAILER</button>
            </div>
        </section>
    );
}
