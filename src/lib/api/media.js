import { http } from '../http.js';

/**
 * Public media listing
 * @param {Object} params
 * @param {string} [params.type] - 'movie' | 'series' | 'anime'
 * @param {string} [params.q] - search query
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @param {string} [params.sort] - e.g. '-metrics.weightedScore'
 */
export async function getPublicMedia(params = {}) {
  const qs = new URLSearchParams();
  if (params.type) qs.set('type', params.type);
  if (params.q) qs.set('q', params.q);
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.sort) qs.set('sort', params.sort);
  return await http.get(`/api/v1/media/public?${qs.toString()}`);
}

export async function getRanking(params = {}) {
  const qs = new URLSearchParams();
  if (params.limit) qs.set('limit', String(params.limit));
  return await http.get(`/api/v1/media/ranking?${qs.toString()}`);
}

export async function getPopular(params = {}) {
  const qs = new URLSearchParams();
  if (params.limit) qs.set('limit', String(params.limit));
  return await http.get(`/api/v1/media/popular?${qs.toString()}`);
}

export async function getByCategory(slug, params = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  return await http.get(`/api/v1/media/category/${encodeURIComponent(slug)}?${qs.toString()}`);
}

// ==========================================
// ADMIN FUNCTIONS - Additional routes for administration
// ==========================================

/**
 * Get ALL media for admin management - loads everything once
 * @param {string} token - Authorization token
 */
export async function getAdminMedia(token) {
  try {
    // Get ALL media with maximum limit, no filters
    const url = `/api/v1/media?limit=10000&page=1`;


    const response = await http.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error('getAdminMedia: Error occurred:', error);
    throw error;
  }
}

/**
 * Get pending media only - uses public route with status filter
 * @param {Object} params
 * @param {string} [params.category] - category filter
 * @param {number} [params.page]
 * @param {number} [params.limit]
 */
export async function getPendingMedia(params = {}, token) {
  try {
    const response = await http.get(`/api/v1/media?status=pending`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error('getPendingMedia: Error occurred:', error);
    throw error;
  }
}

/**
 * Get media by ID - may need to use public route or implement differently
 * @param {string|number} id - Media ID
 */
export async function getMediaByIdAdmin(id) {
  // Try to use existing public media route structure
  // Backend should have a route to get individual media items
  return await http.get(`/api/v1/media/${id}`);
}

/**
 * Update media status (approve/reject)
 * @param {string|number} id - Media ID
 * @param {string} status - 'approved' | 'rejected' | 'pending'
 * @param {string} token - Authorization token
 * @param {string} [reason] - Optional reason for rejection
 */
export async function updateMediaStatus(id, status, token, reason = '') {
  if (status === 'approved') {
    return await http.put(`/api/v1/media/${id}/approve`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } else if (status === 'rejected') {
    return await http.put(`/api/v1/media/${id}/reject`, { reason }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  throw new Error(`Unsupported status: ${status}`);
}

/**
 * Update media information (admin)
 * @param {string|number} id - Media ID
 * @param {Object} data - Media data to update
 */
export async function updateMediaAdmin(id, data, token) {
  return await http.put(`/api/v1/media/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Delete media (admin)
 * @param {string|number} id - Media ID
 */
export async function deleteMediaAdmin(id, token) {
  return await http.delete(`/api/v1/media/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Create new media (admin)
 * @param {Object} data - Media data
 * @param {string} token - Authorization token
 */
export async function createMediaAdmin(data, token) {
  return await http.post(`/api/v1/media`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get media categories from backend
 * @param {string} token - Authorization token
 */
export async function getMediaCategories(token) {
  try {
    return await http.get('/api/v1/categories', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error getting categories, using fallback:', error);
    // Fallback to static categories if backend fails
    return {
      data: [
        { _id: '1', name: 'Acción' },
        { _id: '2', name: 'Drama' },
        { _id: '3', name: 'Comedia' },
        { _id: '4', name: 'Ciencia Ficción' },
        { _id: '5', name: 'Terror' },
        { _id: '6', name: 'Romance' },
        { _id: '7', name: 'Thriller' },
        { _id: '8', name: 'Documental' },
        { _id: '9', name: 'Animación' },
        { _id: '10', name: 'Fantasía' }
      ]
    };
  }
}

/**
 * Suggest new media - uses POST /media/suggest
 * @param {Object} data - Media suggestion data
 */
export async function suggestMedia(data) {
  return await http.post(`/api/v1/media/suggest`, data);
}