
import { getMediaDetail } from '../../../lib/api/media';
import Header from '../../../components/layout/Header';
import ReviewThread from '../../../components/reviews/ReviewThread';

export const revalidate = 0;

export default async function MediaDetailPage({ params }) {
  const { idOrSlug } = await params;
  let media = null, reviews = [];
  try {
    const data = await getMediaDetail(idOrSlug);
    media = data.media;
    reviews = data.reviews || [];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error loading media detail', e);
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
                  <div className="text-xl font-semibold">{media.metrics.ratingAvg ?? 0}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500">Ratings</div>
                  <div className="text-xl font-semibold">{media.metrics.ratingCount ?? 0}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500">Weighted</div>
                  <div className="text-xl font-semibold">{media.metrics.weightedScore ?? 0}</div>
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
