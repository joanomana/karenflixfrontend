import { http } from '../http.js';

// =================== FUNCIONES DE USUARIOS ===================
// GET /users - Obtener todos los usuarios (solo admin)
export const getUsersList = (params = {}, token) => http.get('/api/v1/users', { 
    query: params,
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
});

// GET /users/{id} - Obtener un usuario por ID
export const getUserById = (id, token) => http.get(`/api/v1/users/${id}`, { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
});

// PUT /users/{id} - Actualizar un usuario (solo admin)
export const updateUser = (id, payload, token) => http.put(`/api/v1/users/${id}`, payload, { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
});

// DELETE /users/{id} - Eliminar un usuario (solo admin)
export const deleteUser = (id, token) => http.delete(`/api/v1/users/${id}`, { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
});

// PATCH /users/{id}/update-profile - Actualizar el perfil del usuario autenticado
export const updateUserProfile = (id, payload, token) => http.patch(`/api/v1/users/${id}/update-profile`, payload, { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
});

// PATCH /users/{id}/change-password - Cambiar contraseña (usuario o admin)
export const changeUserPassword = (id, currentPassword, newPassword, token) => http.patch(`/api/v1/users/${id}/change-password`, 
    { currentPassword, newPassword }, 
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
);

// =================== OBJETO LEGACY (para compatibilidad) ===================
export const users = {
    list: getUsersList,
    get: getUserById,
    update: updateUser,
    delete: deleteUser,
    updateProfile: updateUserProfile,
    changePassword: changeUserPassword,
};

// =================== AUTENTICACIÓN ===================
export const auth = {
    // POST /auth/register - Registrar un nuevo usuario
    register: ({ username, email, password }) => 
        http.post('/api/v1/auth/register', { username, email, password }),
    
    // POST /auth/login - Iniciar sesión
    login: (email, password) => 
        http.post('/api/v1/auth/login', { email, password }),
    
    // GET /auth/profile - Obtener el perfil del usuario autenticado
    profile: (token) => http.get('/api/v1/auth/profile', { 
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
    }),
    
    // POST /auth/refresh-token - Renovar el token de acceso
    refreshToken: (token) => http.post('/api/v1/auth/refresh-token', {}, { 
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
    }),
    
    // POST /auth/logout - Cerrar sesión
    logout: (token) => http.post('/api/v1/auth/logout', {}, { 
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
    }),
};

// =================== FUNCIONES DE CONVENIENCIA ===================
export async function getUsers(token) {
    try {
        const res = await getUsersList({}, token);
        return res.data || res;
    } catch (e) {
        console.error('Error obteniendo usuarios:', e);
        return [];
    }
}

export async function login(email, password) {
    try {
        const res = await auth.login(email, password);
        return res.data || res;
    } catch (e) {
        console.error('Error en login:', e);
        return null;
    }
}

export async function register({ username, email, password }) {
    try {
        const res = await auth.register({ username, email, password });
        return res.data || res;
    } catch (e) {
        console.error('Error en registro:', e);
        return e.data || { success: false, message: e.message || "Error desconocido" };
    }
}

export async function changePasswordSafe(id, currentPassword, newPassword, token) {
    try {
        const res = await changeUserPassword(id, currentPassword, newPassword, token);
        return res.data || res;
    } catch (e) {
        // Mostrar el error específico del backend
        console.error('Error cambiando contraseña:', e.response?.data || e.message);
        return e.response?.data || { success: false, message: e.message || "Error desconocido" };
    }
}