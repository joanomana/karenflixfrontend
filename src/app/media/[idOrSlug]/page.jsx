
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getMediaDetail } from '../../../lib/api/media';
import Header from '../../../components/layout/Header';
import ReviewThread from '../../../components/reviews/ReviewThread';

export default function MediaDetailPage({ params }) {
  const router = useRouter();
  const [media, setMedia] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { idOrSlug } = await params;
        const data = await getMediaDetail(idOrSlug);
        setMedia(data.media);
        setReviews(data.reviews || []);
      } catch (e) {
        console.error('Error loading media detail', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-center items-center py-20">
            <div className="text-xl text-gray-600">Cargando...</div>
          </div>
        </div>
      </main>
    );
  }

  if (!media) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold">No encontrado</h1>
          <p className="text-gray-600">No existe esta media aprobada.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <section className="max-w-5xl mx-auto p-6">
        {/* Botón Volver a Inicio */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <img src={media.imageUrl || '/no-image.svg'} alt={media.title} className="w-full rounded-xl shadow object-cover" />
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
            <h1 className="text-3xl font-bold mb-2">{media.title}</h1>
            <div className="flex flex-wrap gap-2 text-sm text-gray-700 mb-4">
              {media.type && <span className="bg-gray-200 px-2 py-1 rounded">{media.type}</span>}
              {media.year && <span className="bg-gray-200 px-2 py-1 rounded">{media.year}</span>}
              {Array.isArray(media.category) && media.category.map((c, idx) => (
                <span key={idx} className="bg-gray-200 px-2 py-1 rounded">{typeof c === 'string' ? c : (c?.name || '')}</span>
              ))}
            </div>
            {media.description && <p className="text-gray-800 mb-4 whitespace-pre-line">{media.description}</p>}
            {media.metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500">Rating Avg</div>
                  <div className="text-xl font-semibold">{media.metrics.ratingAvg.toFixed(1) ?? "0.0"}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500">Ratings</div>
                  <div className="text-xl font-semibold">{media.metrics.ratingCount.toFixed(1) ?? "0.0"}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500">Weighted</div>
                  <div className="text-xl font-semibold">{media.metrics.weightedScore.toFixed(1) ?? "0.0"}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500">Likes</div>
                  <div className="text-xl font-semibold">{media.metrics.likes ?? 0}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <ReviewThread mediaId={media._id} initialReviews={reviews} />
      </section>
    </main>
  );
}
