"use client";
import React, { useState } from "react";
import { useAdminAuth } from '../../hooks/useAdminAuth';
import AdminDashboard from '../../components/admin/AdminDashboard';
import UsersManagement from '../../components/admin/UsersManagement';
import PendingMedia from '../../components/admin/PendingMedia';
import MediaManagement from '../../components/admin/MediaManagement';

const Admin = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const { 
        loading, 
        error, 
        authToken, 
        currentUser, 
        userId, 
        validateTokenBeforeAction, 
        handleApiError 
    } = useAdminAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Panel Principal', icon: '🏠' },
        { id: 'users', label: 'Usuarios', icon: '👥' },
        { id: 'pending', label: 'Contenido Pendiente', icon: '⏳' },
        { id: 'media', label: 'Media', icon: '🎬' },
    ];

    const renderContent = () => {
        const commonProps = {
            authToken,
            currentUser,
            userId,
            validateTokenBeforeAction,
            handleApiError
        };

        switch (activeSection) {
            case 'dashboard':
                return <AdminDashboard {...commonProps} />;
            case 'users':
                return <UsersManagement {...commonProps} />;
            case 'pending':
                return <PendingMedia {...commonProps} />;
            case 'media':
                return <MediaManagement {...commonProps} />;
            default:
                return <AdminDashboard {...commonProps} />;
        }
    };

    if (loading) return <div className="text-center py-20">Cargando...</div>;
    if (error) return <div className="text-center py-20 text-red-600 font-bold">{error}</div>;
    if (!authToken || !currentUser) return <div className="text-center py-20">Validando acceso...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile/Tablet Navigation - Horizontal Top Bar */}
            <div className="lg:hidden bg-white shadow-lg">
                <div className="px-4 py-3 border-b">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 text-center">Panel Admin</h2>
                </div>
                <nav className="flex overflow-x-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`flex-shrink-0 px-4 py-3 flex flex-col items-center space-y-1 min-w-[80px] transition-colors ${
                                activeSection === item.id 
                                    ? 'bg-blue-50 border-b-4 border-blue-500 text-blue-700' 
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex">
                {/* Desktop Sidebar - Hidden on mobile/tablet */}
                <div className="hidden lg:block w-64 bg-white shadow-lg min-h-screen">
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">Panel Admin</h2>
                    </div>
                    <nav className="mt-6">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full text-left px-6 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                                    activeSection === item.id ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700' : 'text-gray-600'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content - Full width on mobile/tablet, with sidebar space on desktop */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Admin;