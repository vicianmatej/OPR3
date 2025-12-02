import { useEffect, useState } from 'react';
import { WatchlistItem } from '../types';
import { watchlistApi } from '../services/api';

export default function Watchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const response = await watchlistApi.getMy();
      setItems(response.data);
    } catch (error) {
      console.error('Chyba při načítání watchlistu:', error);
    }
  };

  const handleRemove = async (movieId: number) => {
    try {
      await watchlistApi.remove(movieId);
      loadWatchlist();
    } catch (error) {
      console.error('Chyba při odebírání z watchlistu:', error);
    }
  };

  const handleToggleWatched = async (movieId: number, watched: boolean) => {
    try {
      await watchlistApi.markWatched(movieId, !watched);
      loadWatchlist();
    } catch (error) {
      console.error('Chyba při změně stavu:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Můj Watchlist</h2>
      {items.length === 0 ? (
        <p>Watchlist je prázdný</p>
      ) : (
        <div>
          {items.map(item => (
            <div key={item.id} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}>
              <h3>{item.movieTitle}</h3>
              {item.posterUrl && <img src={item.posterUrl} alt={item.movieTitle} style={{ maxWidth: '100px' }} />}
              <p>Přidáno: {new Date(item.addedAt).toLocaleDateString()}</p>
              <label>
                <input 
                  type="checkbox" 
                  checked={item.watched}
                  onChange={() => handleToggleWatched(item.movieId, item.watched)}
                />
                Zhlédnuto
              </label>
              <button onClick={() => handleRemove(item.movieId)}>Odebrat</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
