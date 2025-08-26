'use client'
import {useState, useEffect} from 'react'

export default function Header() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        const user = JSON.parse(userData);
        setUser(user)
        const {username} = user.user
        setUsername(username);  
    }, []);

    return (
        <header className="flex items-center justify-between px-8 py-4 bg-black text-white">
            <div className="flex items-center gap-2">
                <img src="/window.svg" alt="Logo" className="w-8 h-8" />
                <span className="font-bold text-xl">MovieBox</span>
            </div>
            <div className="flex-1 mx-8">
                <input
                    type="text"
                    placeholder="What do you want to watch?"
                    className="w-full px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
                />
            </div>
            <div className="flex items-center gap-4">
                        {!user ? (
                            <>
                                <a href="/login" className="text-white hover:underline">Sign In</a>
                                <span className="mx-2">|</span>
                                <a href="/register" className="text-white hover:underline">Sign Up</a>
                            </>
                        ) : (
                            <span className="font-semibold text-white">{username}</span>
                        )}
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800">
                    <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
            </div>
        </header>
    );
}
