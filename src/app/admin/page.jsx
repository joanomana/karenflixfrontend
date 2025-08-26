'use client'
import React, { useEffect, useState } from 'react';
import { getUsers } from '../../lib/api/users';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getUsers()
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Error al cargar usuarios');
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Cargando usuarios...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className=''>
            <h2>Panel de Administrador</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.nombre} ({user.email})</li>
                ))}
            </ul>
        </div>
    );  
};

export default Admin;