'use client';
import React, { useEffect, useState } from 'react';
import { getApiBaseUrl } from '../../lib/http';

export default function SuggestMediaModal({ open, onClose, onSuccess }) {
  const api = getApiBaseUrl();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [okMsg, setOkMsg] = useState('');
  const [imgOk, setImgOk] = useState(false);
  const [form, setForm] = useState({
    title: '',
    year: '',
    type: 'movie',
    description: '',
    category: '',      // texto simple -> se enviará como { name: '...' }
    imageUrl: ''
  });

  useEffect(() => {
    if (!open) {
      setError('');
      setOkMsg('');
      setLoading(false);
      setImgOk(false);
      setForm({
        title: '',
        year: '',
        type: 'movie',
        description: '',
        category: '',
        imageUrl: ''
      });
    }
  }, [open]);

  function isLoggedIn() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('jwt');
  }

  function validate() {
    if (!form.title.trim()) return 'El título es obligatorio.';
    if (!String(form.year).trim() || isNaN(Number(form.year))) return 'El año es obligatorio y debe ser numérico.';
    const y = Number(form.year);
    if (y < 1900 || y > 2100) return 'El año debe estar entre 1900 y 2100.';
    if (!['movie', 'series', 'anime'].includes(form.type)) return 'Tipo inválido.';
    if (!form.description.trim()) return 'La descripción es obligatoria.';
    if (!form.category.trim()) return 'La categoría es obligatoria.';
    if (!form.imageUrl.trim()) return 'La imagen (URL) es obligatoria.';
    return '';
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setOkMsg('');

    if (!isLoggedIn()) {
      setError('Debes iniciar sesión para sugerir.');
      return;
    }

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const token = localStorage.getItem('jwt');
    const payload = {
      title: form.title.trim(),
      year: Number(form.year),
      type: form.type,
      description: form.description.trim(),
      category: { name: form.category.trim() }, // 👈 en el formato correcto
      imageUrl: form.imageUrl.trim()
    };

    setLoading(true);
    try {
      const res = await fetch(`${api}/api/v1/media/suggest`, {
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
      if (!res.ok) throw new Error(data?.message || text || 'No se pudo enviar la sugerencia.');

      setOkMsg('¡Sugerencia enviada!');
      onSuccess?.(data);
      setTimeout(() => onClose?.(), 600);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white text-black w-full max-w-2xl rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Sugerir nueva media</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-black">✕</button>
        </div>

        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4 text-black">
          <div className="md:col-span-1 space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Título *</label>
              <input
                className="w-full border rounded px-3 py-2 text-black"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Año *</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 text-black"
                  value={form.year}
                  onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Tipo *</label>
                <select
                  className="w-full border rounded px-3 py-2 text-black"
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                >
                  <option value="movie">Película</option>
                  <option value="series">Serie</option>
                  <option value="anime">Anime</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Categoría *</label>
              <input
                className="w-full border rounded px-3 py-2 text-black"
                placeholder="Ej: Fantasía"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              />
              <p className="text-xs text-black mt-1"></p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Descripción *</label>
              <textarea
                rows={5}
                className="w-full border rounded px-3 py-2 text-black"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-3">
              <button disabled={loading} className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-60">
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
              <button type="button" onClick={onClose} className="px-4 py-2 rounded border">
                Cancelar
              </button>
            </div>

            {error && <p className="text-red-600">{error}</p>}
            {okMsg && <p className="text-green-700">{okMsg}</p>}
          </div>

          <div className="md:col-span-1 space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Imagen (URL) *</label>
              <input
                className="w-full border rounded px-3 py-2 text-black"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={e => { setForm(f => ({ ...f, imageUrl: e.target.value })); setImgOk(false); }}
              />
            </div>

            <div className="border rounded-xl p-2 h-[320px] flex items-center justify-center bg-gray-50">
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className={`max-h-full max-w-full object-contain rounded ${imgOk ? '' : 'opacity-80'}`}
                  onLoad={() => setImgOk(true)}
                  onError={() => setImgOk(false)}
                />
              ) : (
                <span className="text-gray-500 text-sm">Previsualización</span>
              )}
            </div>

            <p className={`text-sm ${imgOk ? 'text-green-700' : 'text-gray-500'}`}>
              {form.imageUrl
                ? (imgOk ? 'Imagen cargada correctamente.' : 'Cargando/No válida…')
                : 'Cargará aquí la imagen si la URL es válida.'}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
