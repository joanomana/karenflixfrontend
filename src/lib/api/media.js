import { http } from '../http.js';

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

// Nuevo: obtener detalle de media
export async function getMediaDetail(idOrSlug, opts = { includeReviews: true }) {
  const qs = new URLSearchParams();
  if (opts?.includeReviews) qs.set('include', 'reviews');
  return await http.get(`/api/v1/media/public/${encodeURIComponent(idOrSlug)}?${qs.toString()}`);
}
