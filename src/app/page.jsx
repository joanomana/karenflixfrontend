import Header from '../components/layout/Header';
import Hero from '../components/home/Hero';
import MovieSection from '../components/home/MovieSection';

const featuredMovies = [
  {
    id: 1,
    title: 'Stranger Things',
    image: 'https://i.imgur.com/8Q1QZQp.jpg',
    rating: 860,
    year: '2016 - Current',
    percentage: 97,
    genre: 'Action, Adventure, Horror',
    description: 'USA, 2016 - Current',
  },
  {
    id: 2,
    title: 'Batman Begins',
    image: 'https://i.imgur.com/2l5QbQp.jpg',
    rating: 920,
    year: '2005',
    percentage: 70,
    genre: 'Action, Adventure',
    description: 'USA, 2005',
  },
  {
    id: 3,
    title: 'Spider-Man : Into The Spider Verse',
    image: 'https://i.imgur.com/3Q1QZQp.jpg',
    rating: 840,
    year: '2018',
    percentage: 87,
    genre: 'Animation, Action, Adventure',
    description: 'USA, 2018',
  },
  {
    id: 4,
    title: 'Dunkirk',
    image: 'https://i.imgur.com/4Q1QZQp.jpg',
    rating: 780,
    year: '2017',
    percentage: 94,
    genre: 'Action, Drama, History',
    description: 'USA, 2017',
  },
];

const newArrivals = [
  {
    id: 5,
    title: 'The Witcher',
    image: 'https://i.imgur.com/5Q1QZQp.jpg',
    rating: 800,
    year: '2019',
    percentage: 90,
    genre: 'Action, Adventure, Fantasy',
    description: 'USA, 2019',
  },
  {
    id: 6,
    title: 'Joker',
    image: 'https://i.imgur.com/6Q1QZQp.jpg',
    rating: 950,
    year: '2019',
    percentage: 98,
    genre: 'Crime, Drama, Thriller',
    description: 'USA, 2019',
  },
];

export default function HomePage() {
  return (
    <main className="bg-gray-100 min-h-screen">
      <Header />
      <Hero />
      <MovieSection title="Featured Movie" movies={featuredMovies} />
      <MovieSection title="New Arrival" movies={newArrivals} />
    </main>
  );
}
