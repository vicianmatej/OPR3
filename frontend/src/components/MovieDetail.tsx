import { useEffect, useState } from 'react';
import { movieApi, reviewApi, ratingApi } from '../services/api';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';

interface Movie {
  id: number;
  title: string;
  description?: string;
  releaseYear?: number;
  genre?: string;
  director?: string;
  posterUrl?: string;
  averageRating?: number;
  ratingCount?: number;
}

interface Review {
  id: number;
  reviewText: string;
  movieId: number;
  movieTitle: string;
  createdAt: string;
}

interface MovieDetailProps {
  movieId: number;
  onClose: () => void;
}

export default function MovieDetail({ movieId, onClose }: MovieDetailProps) {
  const [movie, setMovie] = useState<Movie | null>(null); // Data filmu
  const [reviews, setReviews] = useState<Review[]>([]); // Seznam recenzí
  const [newReview, setNewReview] = useState(''); // Text nové recenze
  const [userRating, setUserRating] = useState(0); // Hodnocení uživatele
  const [hoveredStar, setHoveredStar] = useState(0); // Hvězdička přes kterou je myš
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // Zobrazit dialog pro smazání
  const [isEditing, setIsEditing] = useState(false); // Režim úprav
  const [editData, setEditData] = useState<any>({}); // Data pro úpravu
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null); // Notifikace

  useEffect(() => {
    loadMovie();
    loadReviews();
    loadUserRating();
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

  const loadUserRating = async () => {
    try {
      const userIdStr = localStorage.getItem('userId');
      if (!userIdStr) return;
      const userId = parseInt(userIdStr, 10);
      const response = await ratingApi.getUserRating(userId, movieId);
      setUserRating(response.data);
    } catch (error) {
      setUserRating(0);
    }
  };

  const handleAddReview = async () => {
    if (!newReview.trim()) return;
    try {
      await reviewApi.create({ reviewText: newReview, movieId });
      setNewReview('');
      loadReviews();
      setToast({ message: 'Recenze byla přidána', type: 'success' });
    } catch (error) {
      console.error('Chyba při přidávání recenze:', error);
      setToast({ message: 'Chyba při přidávání recenze', type: 'error' });
    }
  };

  const handleEdit = () => {
    setEditData({
      title: movie?.title || '',
      description: movie?.description || '',
      releaseYear: movie?.releaseYear || '',
      genre: movie?.genre || '',
      director: movie?.director || '',
      posterUrl: movie?.posterUrl || ''
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await movieApi.update(movieId, editData);
      setIsEditing(false);
      loadMovie();
      setToast({ message: 'Film byl úspěšně aktualizován', type: 'success' });
    } catch (error) {
      console.error('Chyba při aktualizaci filmu:', error);
      setToast({ message: 'Chyba při aktualizaci filmu', type: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await movieApi.delete(movieId);
      setToast({ message: 'Film byl úspěšně smazán', type: 'success' });
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error('Chyba při mazání filmu:', error);
      setToast({ message: 'Chyba při mazání filmu', type: 'error' });
    }
    setShowDeleteDialog(false);
  };

  const handleRating = async (score: number) => {
    try {
      await ratingApi.create(score, movieId);
      setUserRating(score);
      loadMovie();
      loadReviews();
      setToast({ message: `Film ohodnocen ${score} hvězdičkami`, type: 'success' });
    } catch (error: any) {
      console.error('Chyba při hodnocení:', error);
      console.error('Response data:', error.response?.data);
      console.error('Request data:', { score, movieId, userId: localStorage.getItem('userId') });
      setToast({ message: 'Chyba při hodnocení filmu', type: 'error' });
    }
  };

  if (!movie) return <div style={{ color: '#fff', textAlign: 'center', padding: '40px' }}>Načítání...</div>;

  return (
    <div style={{ 
      padding: '40px 4%',
      minHeight: '100vh'
    }}>
      <button 
        onClick={onClose}
        style={{
          padding: '10px 20px',
          background: 'rgba(255,255,255,0.1)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '30px'
        }}
      >
        ← Zpět
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '400px 1fr',
        gap: '50px',
        marginBottom: '40px'
      }}>
        <div>
          {movie.posterUrl ? (
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              style={{ 
                width: '100%',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }} 
            />
          ) : (
            <div style={{
              width: '100%',
              height: '600px',
              background: 'linear-gradient(135deg, #333 0%, #555 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '18px'
            }}>
              Bez posteru
            </div>
          )}
        </div>

        <div>
          {isEditing ? (
            <input
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '36px',
                fontWeight: '700',
                marginBottom: '10px'
              }}
            />
          ) : (
            <h1 style={{ 
              color: '#fff', 
              fontSize: '36px',
              marginBottom: '10px',
              fontWeight: '700'
            }}>{movie.title}</h1>
          )}

          <div style={{ 
            display: 'flex', 
            gap: '20px',
            marginBottom: '20px',
            color: '#999',
            fontSize: '16px'
          }}>
            <span>{movie.releaseYear}</span>
            <span>•</span>
            <span>{movie.genre}</span>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              {movie.averageRating ? (
                <>
                  <span style={{ color: '#FFD700', fontSize: '24px' }}>⭐</span>
                  <span style={{ color: '#fff', fontSize: '20px', fontWeight: '600' }}>
                    {movie.averageRating.toFixed(1)}/5
                  </span>
                  <span style={{ color: '#999', fontSize: '14px' }}>
                    ({movie.ratingCount} hodnocení)
                  </span>
                </>
              ) : (
                <span style={{ color: '#999', fontSize: '16px' }}>Zatím žádné hodnocení</span>
              )}
            </div>

            <div style={{ marginTop: '15px' }}>
              <p style={{ color: '#fff', fontSize: '14px', marginBottom: '10px', fontWeight: '600' }}>Ohodnoťte tento film:</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    style={{
                      fontSize: '32px',
                      cursor: 'pointer',
                      color: (hoveredStar || userRating) >= star ? '#FFD700' : '#444',
                      transition: 'all 0.2s',
                      transform: (hoveredStar || userRating) >= star ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          {isEditing ? (
            <>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  marginBottom: '10px',
                  resize: 'vertical'
                }}
              />
              <input
                placeholder="Režisér"
                value={editData.director}
                onChange={(e) => setEditData({...editData, director: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  marginBottom: '10px'
                }}
              />
              <input
                placeholder="Žánr"
                value={editData.genre}
                onChange={(e) => setEditData({...editData, genre: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  marginBottom: '10px'
                }}
              />
              <input
                placeholder="Rok vydání"
                type="number"
                value={editData.releaseYear}
                onChange={(e) => setEditData({...editData, releaseYear: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  marginBottom: '30px'
                }}
              />
            </>
          ) : (
            <>
              <p style={{ 
                color: '#ccc',
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>{movie.description}</p>

              <p style={{ color: '#999', marginBottom: '30px' }}>
                <strong style={{ color: '#fff' }}>Režisér:</strong> {movie.director}
              </p>
            </>
          )}

          {localStorage.getItem('userRole') === 'ADMIN' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {isEditing ? (
                <>
                  <button 
                    onClick={handleSaveEdit}
                    style={{
                      padding: '12px 24px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    Uložit
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: '12px 24px',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    Zrušit
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleEdit}
                    style={{
                      padding: '12px 24px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 15px rgba(0, 123, 255, 0.4)'
                    }}
                  >
                    Upravit film
                  </button>
                  <button 
                    onClick={() => setShowDeleteDialog(true)}
                    style={{
                      padding: '12px 24px',
                      background: '#e50914',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)'
                    }}
                  >
                    Smazat film
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        padding: '30px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h3 style={{ 
          color: '#fff',
          fontSize: '24px',
          marginBottom: '20px'
        }}>Recenze</h3>

        <div style={{ marginBottom: '30px' }}>
          <textarea 
            value={newReview} 
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Napište svou recenzi..."
            rows={4}
            style={{ 
              width: '100%',
              padding: '15px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <button 
            onClick={handleAddReview}
            style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Přidat recenzi
          </button>
        </div>

        <div>
          {reviews.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center' }}>Zatím žádné recenze</p>
          ) : (
            reviews.map(review => (
              <div 
                key={review.id} 
                style={{ 
                  padding: '20px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}
              >
                {review.userRating && review.userRating > 0 && (
                  <div style={{ marginBottom: '10px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <span style={{ color: '#999', fontSize: '14px', marginRight: '5px' }}>Hodnocení:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          fontSize: '20px',
                          color: star <= review.userRating! ? '#FFD700' : '#444'
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
                <p style={{ color: '#fff', marginBottom: '10px' }}>{review.reviewText}</p>
                <small style={{ color: '#999' }}>
                  {new Date(review.createdAt).toLocaleDateString('cs-CZ')}
                </small>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Smazat film?"
        message="Opravdu chcete smazat tento film? Tato akce je nevratná."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}