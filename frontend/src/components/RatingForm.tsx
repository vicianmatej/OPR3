import { useState } from 'react';
import { ratingApi } from '../services/api';

interface Props {
  movieId: number;
  userId: number;
  onSuccess: () => void;
}

export default function RatingForm({ movieId, userId, onSuccess }: Props) {
  const [rating, setRating] = useState(5);

  const handleSubmit = async () => {
    try {
      await ratingApi.create({ movieId, userId, rating });
      onSuccess();
    } catch (error) {
      console.error('Chyba při hodnocení:', error);
    }
  };

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <label>
        Hodnocení: 
        <input
          type="number"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={{ margin: '0 0.5rem', padding: '0.25rem', width: '60px' }}
        />
      </label>
      <button onClick={handleSubmit} style={{ padding: '0.25rem 0.5rem' }}>Ohodnotit</button>
    </div>
  );
}
