import Header from '../../components/layout/Header';
import MovieSection from '../../components/home/MovieSection';
import { getPublicMedia } from '../../lib/api';

function mapItem(m) {
  const year = m?.year || '';
  // category can be: string | {name:string} | array of any of those
  let category = '';
  const c = m?.category;
  if (Array.isArray(c)) {
    category = c.map(x => (typeof x === 'string' ? x : (x?.name || ''))).filter(Boolean).join(', ');
  } else if (c && typeof c === 'object') {
    category = c.name || '';
  } else if (typeof c === 'string') {
    category = c;
  }
  const rating = (m?.metrics?.ratingAvg != null) ? Number(m.metrics.ratingAvg).toFixed(1) : (m?.rating ?? '');
  const percentage = (m?.metrics?.weightedScore != null) ? Math.round(m.metrics.weightedScore) : (m?.percentage ?? '');
  return {
    id: m._id || m.id,
    title: m.title,
    image: m.image || m.imageUrl,
    rating,
    year,
    percentage,
    genre: category,
    description: (m.type ? (m.type[0].toUpperCase() + m.type.slice(1)) : '') + (year ? `, ${year}` : '')
  };
}

export default async function SearchPage({ searchParams }) {
  const q = searchParams?.q || '';
  const [animeRes, moviesRes, seriesRes] = await Promise.all([
    getPublicMedia({ type: 'anime', q, limit: 20, sort: '-metrics.weightedScore' }),
    getPublicMedia({ type: 'movie', q, limit: 20, sort: '-metrics.weightedScore' }),
    getPublicMedia({ type: 'series', q, limit: 20, sort: '-metrics.weightedScore' }),
  ]);

  const animeMapped = (animeRes?.items || []).map(mapItem);
  const moviesMapped = (moviesRes?.items || []).map(mapItem);
  const seriesMapped = (seriesRes?.items || []).map(mapItem);

  return (
    <main className="bg-gray-100 min-h-screen">
      <Header />
      <div className="px-8 pt-6">
        <h1 className="text-2xl font-bold mb-4">Resultados para: <span className="text-red-600">{q}</span></h1>
      </div>
      <MovieSection title="Anime" movies={animeMapped} />
      <MovieSection title="Películas" movies={moviesMapped} />
      <MovieSection title="Series" movies={seriesMapped} />
    </main>
  );
}