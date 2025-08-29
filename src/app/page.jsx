import Header from '../components/layout/Header';
import Hero from '../components/home/Hero';
import MovieSection from '../components/home/MovieSection';
import { getPublicMedia } from '../lib/api';


export const revalidate = 3600; // Revalidate every hour

function mapItem(m) {
  const year = m?.year || '';

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

export default async function HomePage() {
  let animeMapped = [];
  let moviesMapped = [];
  let seriesMapped = [];

  try {
    const [{ items: anime = [] }, { items: movies = [] }, { items: series = [] }] = await Promise.all([
      getPublicMedia({ type: 'anime', limit: 20, sort: '-metrics.weightedScore' }),
      getPublicMedia({ type: 'movie', limit: 20, sort: '-metrics.weightedScore' }),
      getPublicMedia({ type: 'series', limit: 20, sort: '-metrics.weightedScore' }),
    ]);

    animeMapped = (anime || []).map(mapItem);
    moviesMapped = (movies || []).map(mapItem);
    seriesMapped = (series || []).map(mapItem);
  } catch (error) {
    console.error('Error fetching media data:', error);

  }

  return (
    <main className="bg-gray-100 min-h-screen">
      <Header />
      <Hero />
      <MovieSection title="Anime" movies={animeMapped} />
      <MovieSection title="Películas" movies={moviesMapped} />
      <MovieSection title="Series" movies={seriesMapped} />
    </main>
  );
}