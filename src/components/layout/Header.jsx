'use client'
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SuggestMediaModal from '../media/SuggestMediaModal';


export default function Header() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const username = user?.user?.username || user?.username || '';
    const role = user?.user?.role || user?.role || '';
    const userId = user?.user?.id || user?.id || '';
    const [menuOpen, setMenuOpen] = useState(false);

    const [showSuggest, setShowSuggest] = useState(false);
    const openSuggest = () => setShowSuggest(true);
    const closeSuggest = () => setShowSuggest(false);

    return (
        <header className="flex items-center justify-between px-8 py-4 bg-black text-white">
            <div className="flex items-center gap-2">
                <img src="/window.svg" alt="Logo" className="w-8 h-8" />
                <span className="font-bold text-xl">MovieBox</span>
            </div>
            <div className="flex-1 mx-8">
                <form
                onSubmit={(e) => { e.preventDefault(); if (query && query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`); }}
                className="w-full"
            >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What do you want to watch?"
                    className="w-full px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
                />
            </form>
            </div>
            <div className="flex items-center gap-4">
                {username ? (
                    <div className="flex items-center gap-2 relative">
                        <span className="font-semibold text-white">{username}</span>
                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800"
                            aria-label="Menú"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 top-12 bg-white text-black rounded shadow-lg min-w-[180px] z-50">
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => { setMenuOpen(false); window.location.href = `/usuario/${userId}`; }}
                                >Ver perfil</button>
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => { setMenuOpen(false); window.location.href = `/perfil/editar/${userId}`; }}
                                >Cambiar datos personales</button>
                                {role === 'admin' && (
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={() => { setMenuOpen(false); window.location.href = '/admin'; }}
                                    >Menú administrador</button>
                                )}
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                    onClick={() => { setMenuOpen(false); logout(); }}
                                >Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-full transition"
                        onClick={() => window.location.href = '/login'}
                    >
                        Join Us
                    </button>
                )}
            </div>
        {user && (
            <div className="ml-4 inline-block">
              <button onClick={openSuggest} className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition">
                Sugerir
              </button>
            </div>
          )}
          <SuggestMediaModal open={showSuggest} onClose={closeSuggest} onSuccess={() => {}} />
        </header>
    );
}
