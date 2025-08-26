import { http } from '../http.js';

export const users = {
    list: (params = {}) => http.get('/api/v1/users', { query: params }),
    get: (id) => http.get(`/api/v1/users/${id}`),
    create: (payload) => http.post('/api/v1/users', payload),
    update: (id, payload) => http.put(`/api/v1/users/${id}`, payload),
    delete: (id) => http.del(`/api/v1/users/${id}`),
};

export async function getUsers() {
    try {
        const res = await users.list();
        return res.data || res;
    } catch (e) {
        return [];
    }
}

export async function login(email, password) {
    try {
        const res = await http.post('/api/v1/auth/login', { email, password });
        console.log(res.data)
        console.log(res)
        return res.data || res;
    } catch (e) {
        return null;
    }
}