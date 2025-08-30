
'use client';
import React, { useState, useEffect } from 'react';
import { getApiBaseUrl } from '../../lib/http';

export default function ReviewThread({ mediaId, initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [form, setForm] = useState({ title: '', comment: '', rating: 7 });
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);
      const [myReacts, setMyReacts] = useState({});

  const api = getApiBaseUrl();

  function isLoggedIn() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('jwt');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!isLoggedIn()) {
      setError('Debes iniciar sesión para comentar.');
      return;
    }
    if (!form.title.trim() || !form.comment.trim()) {
      setError('Completa título y comentario.');
      return;
    }
    setPosting(true);
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${api}/api/v1/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mediaId, ...form })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Error al crear reseña');
      // Prepend new review (basic)
      
          const tempId = data?.review?._id || (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `tmp-${Date.now()}`);
          const created = data?.review?.createdAt || new Date().toISOString();
          const userBasic = data?.review?.userId || { name: 'Tú' };
          setReviews(prev => [{ ...(data.review || {}), _id: tempId, tempId, userId: userBasic, createdAt: created }, ...prev]);
    
      setForm({ title: '', comment: '', rating: 7 });
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  
      async function react(reviewId, value) {
        if (!isLoggedIn()) { setError('Debes iniciar sesión para reaccionar.'); return; }
        const prev = myReacts[reviewId] || 0; // 1, -1 o 0 (sin reacción)
        if (prev === value) return;

        try {
          const token = localStorage.getItem('jwt');
          const res = await fetch(`${api}/api/v1/reviews/${reviewId}/reaction`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ value })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.message || 'Error al reaccionar');

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
    );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Error al reaccionar');
      // Update counts locally
      setReviews(prev => prev.map(r => {
        if (r._id === reviewId) {
          const likes = (r.likesCount || 0) + (value === 1 ? 1 : 0);
          const dislikes = (r.dislikesCount || 0) + (value === -1 ? 1 : 0);
          return { ...r, likesCount: likes, dislikesCount: dislikes };
        }
        return r;
      }));
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
        {reviews.map((r, idx) => { const key = r._id || r.tempId || `${r?.userId?._id || r?.userId || 'u'}-${r?.createdAt || idx}`; return (
          <article key={key} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold">{r.title}</h4>
              <span className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Por: <strong>{r?.userId?.name || 'Anónimo'}</strong> — Rating: <strong>{r.rating}</strong>
            </div>
            <p className="text-gray-800 whitespace-pre-line">{r.comment}</p>
            <div className="flex items-center gap-4 mt-3">
              <button onClick={() => react(r._id, 1)} className="text-green-700 hover:underline">
                {myReacts[r._id] === 1 ? '👍 (tú) ' : '👍 '} {r.likesCount || 0}
              </button>
              <button onClick={() => react(r._id, -1)} className="text-red-700 hover:underline">
                {myReacts[r._id] === -1 ? '👎 (tú) ' : '👎 '} {r.dislikesCount || 0}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
