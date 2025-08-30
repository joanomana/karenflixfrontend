'use client';
import React, { useState, useEffect } from 'react';
import { getApiBaseUrl } from '../../lib/http';

export default function ReviewThread({ mediaId, initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [form, setForm] = useState({ title: '', comment: '', rating: 7 });
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);
  const [myReacts, setMyReacts] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', comment: '', rating: 7 });

  const api = getApiBaseUrl();

  function isLoggedIn() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('jwt');
  }

  function getCurrentUserId() {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return null;
      const u = JSON.parse(raw);
      // Tu localStorage guardaba algo como: {"user":{"id":"...","username":"..."}}
      return u?.user?._id || u?.user?.id || u?._id || u?.id || null;
    } catch { return null; }
  }

  function isMine(review) {
    const uid = getCurrentUserId();
    const rid = (typeof review?.userId === 'object') ? (review?.userId?._id) : review?.userId;
    return uid && rid && String(uid) === String(rid);
  }

  // --- Cargar/Refrescar reseñas del servidor (para que se actualice en caliente) ---
  async function fetchReviews() {
    try {
      const res = await fetch(`${api}/api/v1/reviews?mediaId=${mediaId}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(Array.isArray(data.items) ? data.items : []);
      }
    } catch (e) {
      // no-op
    }
  }

  useEffect(() => {
    if (mediaId) fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!isLoggedIn()) {
      setError('Debes iniciar sesión para comentar.');
      return;
    }

    const title = (form.title || '').trim();
    const comment = (form.comment || '').trim();
    const r = Number(form.rating);
    const rating = Number.isFinite(r) ? Math.round(r) : NaN;

    // Validaciones rápidas (evita 400 del backend)
    if (!title || !comment) { setError('Completa título y comentario.'); return; }
    if (!Number.isFinite(rating) || rating < 1 || rating > 10) { setError('El rating debe ser 1..10.'); return; }
    if (!mediaId || !/^[a-fA-F0-9]{24}$/.test(String(mediaId))) {
      setError('mediaId inválido (debe ser ObjectId).');
      return;
    }

    setPosting(true);
    try {
      const token = localStorage.getItem('jwt');
      const payload = { mediaId, title, comment, rating };

      const res = await fetch(`${api}/api/v1/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch {}
      if (!res.ok) throw new Error(data?.message || text || 'Error al crear reseña');

      // Optimista: la muestro de una vez
      const currentUserId = getCurrentUserId();
      const tempId = data?.review?._id || (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `tmp-${Date.now()}`);
      const created = data?.review?.createdAt || new Date().toISOString();
      const userBasic = data?.review?.userId || { _id: currentUserId, name: 'Tú' };

      setReviews(prev => [{ ...(data?.review || {}), _id: tempId, tempId, userId: userBasic, createdAt: created }, ...prev]);

      // Refresco desde servidor para garantizar consistencia
      fetchReviews();

      setForm({ title: '', comment: '', rating: 7 });
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  function startEdit(r) {
    setEditingId(r._id);
    setEditForm({ title: r.title || '', comment: r.comment || '', rating: r.rating ?? 7 });
  }
  function cancelEdit() { setEditingId(null); }

  async function saveEdit() {
    if (!isLoggedIn()) { setError('Debes iniciar sesión.'); return; }
    const token = localStorage.getItem('jwt');
    const r = Number(editForm.rating);
    const rating = Number.isFinite(r) ? Math.round(r) : NaN;
    if (!editForm.title.trim() || !editForm.comment.trim()) { setError('Completa título y comentario.'); return; }
    if (!Number.isFinite(rating) || rating < 1 || rating > 10) { setError('Rating 1..10'); return; }

    try {
      const res = await fetch(`${api}/api/v1/reviews/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: editForm.title, comment: editForm.comment, rating })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Error al actualizar reseña');

      setReviews(prev => prev.map(x => x._id === editingId ? { ...x, ...data.review } : x));
      setEditingId(null);
      fetchReviews();
    } catch (e) {
      setError(e.message);
    }
  }

  async function removeReview(id) {
    if (!isLoggedIn()) { setError('Debes iniciar sesión.'); return; }
    const token = localStorage.getItem('jwt');
    try {
      const res = await fetch(`${api}/api/v1/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Error al eliminar reseña');

      setReviews(prev => prev.filter(x => x._id !== id));
      if (editingId === id) setEditingId(null);
      fetchReviews();
    } catch (e) {
      setError(e.message);
    }
  }

  async function react(reviewId, value) {
    if (!isLoggedIn()) { setError('Debes iniciar sesión para reaccionar.'); return; }
    const prev = myReacts[reviewId] || 0; // 1, -1 o 0
    if (prev === value) return; // no hacer nada si repiten la misma reacción

    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${api}/api/v1/reviews/${reviewId}/reaction`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ value })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Error al reaccionar');

      // Exclusivo: cancela la reacción opuesta si existía
      setReviews(prevReviews => prevReviews.map(r => {
        if (r._id !== reviewId) return r;
        let likes = r.likesCount || 0;
        let dislikes = r.dislikesCount || 0;
        if (prev === 1 && value === -1) { likes = Math.max(0, likes - 1); dislikes += 1; }
        else if (prev === -1 && value === 1) { dislikes = Math.max(0, dislikes - 1); likes += 1; }
        else if (prev === 0 && value === 1) { likes += 1; }
        else if (prev === 0 && value === -1) { dislikes += 1; }
        return { ...r, likesCount: likes, dislikesCount: dislikes };
      }));
      setMyReacts(m => ({ ...m, [reviewId]: value }));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <section className="mt-10">
      <h3 className="text-xl font-semibold mb-4">Reseñas</h3>

      {isLoggedIn() ? (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded-xl shadow">
          <div className="flex gap-4 mb-3">
            <input
              className="flex-1 border rounded px-3 py-2"
              placeholder="Título"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
            <input
              type="number" min="1" max="10"
              className="w-24 border rounded px-3 py-2"
              placeholder="Rating"
              value={form.rating}
              onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
            />
          </div>
          <textarea
            className="w-full border rounded px-3 py-2 mb-3"
            rows={4}
            placeholder="Escribe tu comentario..."
            value={form.comment}
            onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
          />
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <button disabled={posting} className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-60">
            {posting ? 'Publicando...' : 'Publicar reseña'}
          </button>
        </form>
      ) : (
        <p className="text-gray-600 mb-4">Inicia sesión para comentar y reaccionar.</p>
      )}

      <div className="space-y-4">
        {reviews.length === 0 && <p className="text-gray-600">Aún no hay reseñas. ¡Sé el primero!</p>}
        {reviews.map((r, idx) => {
          const key = r._id || r.tempId || `${r?.userId?._id || r?.userId || 'u'}-${r?.createdAt || idx}`;
          return (
            <article key={key} className="bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold">{r.title}</h4>
                <span className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Por: <strong>{r?.userId?.name || 'Anónimo'}</strong> — Rating: <strong>{r.rating}</strong>
              </div>

              {editingId === r._id ? (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="flex gap-3 mb-2">
                    <input className="flex-1 border rounded px-2 py-1" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                    <input className="w-24 border rounded px-2 py-1" type="number" min="1" max="10" value={editForm.rating} onChange={e => setEditForm(f => ({ ...f, rating: Number(e.target.value) }))} />
                  </div>
                  <textarea className="w-full border rounded px-2 py-1" rows={3} value={editForm.comment} onChange={e => setEditForm(f => ({ ...f, comment: e.target.value }))} />
                </div>
              ) : (
                <p className="text-gray-800 whitespace-pre-line">{r.comment}</p>
              )}

              <div className="flex items-center gap-4 mt-3">
                {isMine(r) ? (
                  editingId === r._id ? (
                    <>
                      <button onClick={saveEdit} className="text-blue-700 hover:underline">Guardar</button>
                      <button onClick={cancelEdit} className="text-gray-600 hover:underline">Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(r)} className="text-blue-700 hover:underline">Editar</button>
                      <button onClick={() => removeReview(r._id)} className="text-gray-700 hover:underline">Eliminar</button>
                    </>
                  )
                ) : null}

                <button onClick={() => react(r._id, 1)} className="text-green-700 hover:underline">
                  {myReacts[r._id] === 1 ? '👍 (tú) ' : '👍 '} {r.likesCount || 0}
                </button>
                <button onClick={() => react(r._id, -1)} className="text-red-700 hover:underline">
                  {myReacts[r._id] === -1 ? '👎 (tú) ' : '👎 '} {r.dislikesCount || 0}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
