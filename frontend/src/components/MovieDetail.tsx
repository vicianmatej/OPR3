import { useEffect, useState } from 'react';
import { Movie, Review } from '../types';
import { movieApi, reviewApi, watchlistApi } from '../services/api';

interface MovieDetailProps {
  movieId: number;
  onClose: () => void;
}

export default function MovieDetail({ movieId, onClose }: MovieDetailProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');

  useEffect(() => {
    loadMovie();
    loadReviews();
  }, [movieId]);

  const loadMovie = async () => {
    try {
      const response = await movieApi.getById(movieId);
      setMovie(response.data);
    } catch (error) {
      console.error('Chyba při načítání filmu:', error);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await reviewApi.getByMovie(movieId);
      setReviews(response.data);
    } catch (error) {
      console.error('Chyba při načítání recenzí:', error);
    }
  };

  const handleAddReview = async () => {
    if (!newReview.trim()) return;
    try {
      await reviewApi.create({ reviewText: newReview, movieId });
      setNewReview('');
      loadReviews();
    } catch (error) {
      console.error('Chyba při přidávání recenze:', error);
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      await watchlistApi.add(movieId);
      alert('Film přidán do watchlistu');
    } catch (error) {
      console.error('Chyba při přidávání do watchlistu:', error);
    }
  };

  if (!movie) return <div>Načítání...</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <button onClick={onClose}>Zavřít</button>
      <h2>{movie.title}</h2>
      {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} style={{ maxWidth: '300px' }} />}
      <p><strong>Rok:</strong> {movie.releaseYear}</p>
      <p><strong>Žánr:</strong> {movie.genre}</p>
      <p><strong>Režisér:</strong> {movie.director}</p>
      <p><strong>Popis:</strong> {movie.description}</p>
      <p><strong>Hodnocení:</strong> {movie.averageRating?.toFixed(1) || 'Bez hodnocení'} ({movie.ratingCount || 0} hodnocení)</p>
      
      <button onClick={handleAddToWatchlist}>Přidat do watchlistu</button>

      <h3>Recenze</h3>
      <div>
        <textarea 
          value={newReview} 
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Napište recenzi..."
          rows={4}
          style={{ width: '100%' }}
        />
        <button onClick={handleAddReview}>Přidat recenzi</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {reviews.map(review => (
          <div key={review.id} style={{ padding: '10px', border: '1px solid #eee', marginBottom: '10px' }}>
            <p>{review.reviewText}</p>
            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
