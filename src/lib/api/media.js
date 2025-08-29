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