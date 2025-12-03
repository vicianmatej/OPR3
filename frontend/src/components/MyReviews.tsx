import { useEffect, useState } from 'react';
import { reviewApi } from '../services/api';

interface Review {
  id: number;
  reviewText: string;
  movieId: number;
  movieTitle: string;
  createdAt: string;
}

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await reviewApi.getMy();
      setReviews(response.data);
    } catch (error) {
      console.error('Chyba při načítání recenzí:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await reviewApi.delete(id);
      loadReviews();
    } catch (error) {
      console.error('Chyba při mazání recenze:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Moje recenze</h2>
      {reviews.length === 0 ? (
        <p>Zatím jste nenapsal žádnou recenzi</p>
      ) : (
        <div>
          {reviews.map(review => (
            <div key={review.id} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}>
              <h3>{review.movieTitle}</h3>
              <p>{review.reviewText}</p>
              <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              <button onClick={() => handleDelete(review.id)}>Smazat</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
