import { useEffect, useState } from 'react';
import { reviewApi } from '../services/api';

interface Review {
  id: number;
  reviewText: string;
  movieId: number;
  movieTitle: string;
  createdAt: string;
  userRating?: number;
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
    if (!confirm('Opravdu smazat recenzi?')) return;
    try {
      await reviewApi.delete(id);
      loadReviews();
    } catch (error) {
      console.error('Chyba při mazání recenze:', error);
    }
  };

  return (
    <div style={{ padding: '40px 4%', minHeight: '100vh' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          color: '#fff', 
          fontSize: '32px', 
          marginBottom: '10px', 
          fontWeight: '700',
          background: 'linear-gradient(135deg, #fff 0%, #999 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Moje recenze
        </h2>
        <p style={{ color: '#999', fontSize: '16px' }}>
          {reviews.length} {reviews.length === 1 ? 'recenze' : reviews.length < 5 ? 'recenze' : 'recenzí'}
        </p>
      </div>
      
      {reviews.length === 0 ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(0,0,0,0.3) 100%)',
          borderRadius: '16px',
          padding: '80px 40px',
          textAlign: 'center',
          border: '2px dashed rgba(229, 9, 20, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📝</div>
          <p style={{ color: '#fff', fontSize: '20px', marginBottom: '10px', fontWeight: '600' }}>
            Zatím žádné recenze
          </p>
          <p style={{ color: '#999', fontSize: '16px', margin: 0 }}>
            Začněte psát recenze k filmům, které jste viděli
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid',
          gap: '24px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))'
        }}>
          {reviews.map(review => (
            <div 
              key={review.id} 
              style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease',
                position: 'relative',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(229, 9, 20, 0.15) 0%, rgba(255,255,255,0.08) 100%)';
                e.currentTarget.style.borderColor = 'rgba(229, 9, 20, 0.5)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(229, 9, 20, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '4px',
                  height: '28px',
                  background: 'linear-gradient(180deg, #e50914 0%, #b20710 100%)',
                  borderRadius: '2px'
                }} />
                <h3 style={{ 
                  color: '#fff',
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: 0,
                  letterSpacing: '0.5px'
                }}>
                  {review.movieTitle}
                </h3>
              </div>
              
              {review.userRating && review.userRating > 0 && (
                <div style={{ 
                  marginBottom: '16px', 
                  display: 'flex', 
                  gap: '6px', 
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'rgba(255, 215, 0, 0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 215, 0, 0.2)'
                }}>
                  <span style={{ color: '#FFD700', fontSize: '14px', fontWeight: '600', marginRight: '8px' }}>Vaše hodnocení:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        fontSize: '22px',
                        color: star <= review.userRating! ? '#FFD700' : 'rgba(255, 215, 0, 0.2)',
                        textShadow: star <= review.userRating! ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none'
                      }}
                    >
                      ★
                    </span>
                  ))}
                  <span style={{ color: '#FFD700', fontSize: '16px', fontWeight: '700', marginLeft: '8px' }}>
                    {review.userRating}/5
                  </span>
                </div>
              )}
              
              {review.reviewText && (
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '16px',
                  borderLeft: '3px solid rgba(229, 9, 20, 0.5)'
                }}>
                  <p style={{ 
                    color: '#e0e0e0',
                    fontSize: '15px',
                    lineHeight: '1.8',
                    margin: 0,
                    fontStyle: 'italic'
                  }}>
                    "{review.reviewText}"
                  </p>
                </div>
              )}
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <small style={{ 
                  color: '#aaa',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  {new Date(review.createdAt).toLocaleDateString('cs-CZ', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </small>
                
                <style>{`
                  @keyframes slideIn {
                    from {
                      transform: translateX(100%);
                    }
                    to {
                      transform: translateX(0);
                    }
                  }
                  .delete-btn {
                    position: relative;
                    padding: 10px 22px;
                    border-radius: 6px;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    background-color: #e50914;
                    transition: all 0.2s ease;
                    font-size: 13px;
                    font-weight: 600;
                    overflow: hidden;
                  }
                  .delete-btn:active {
                    transform: scale(0.96);
                  }
                  .delete-btn:before,
                  .delete-btn:after {
                    position: absolute;
                    content: "";
                    width: 150%;
                    left: 50%;
                    height: 100%;
                    transform: translateX(-50%);
                    z-index: -1000;
                    background-repeat: no-repeat;
                  }
                  .delete-btn:hover:before {
                    top: -70%;
                    background-image: radial-gradient(circle, #e50914 20%, transparent 20%),
                      radial-gradient(circle, transparent 20%, #e50914 20%, transparent 30%),
                      radial-gradient(circle, #e50914 20%, transparent 20%),
                      radial-gradient(circle, #e50914 20%, transparent 20%),
                      radial-gradient(circle, transparent 10%, #e50914 15%, transparent 20%),
                      radial-gradient(circle, #e50914 20%, transparent 20%),
                      radial-gradient(circle, #e50914 20%, transparent 20%),
                      radial-gradient(circle, #e50914 20%, transparent 20%),
                      radial-gradient(circle, #e50914 20%, transparent 20%);
                    background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%,
                      10% 10%, 18% 18%;
                    background-position: 50% 120%;
                    animation: greentopBubbles 0.6s ease;
                  }
                  @keyframes greentopBubbles {
                    0% {
                      background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%,
                        40% 90%, 55% 90%, 70% 90%;
                    }
                    50% {
                      background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%,
                        50% 50%, 65% 20%, 90% 30%;
                    }
                    100% {
                      background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%,
                        50% 40%, 65% 10%, 90% 20%;
                      background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
                    }
                  }
                  .delete-btn:hover::after {
                    bottom: -70%;
                    background-image: radial-gradient(circle, #e50914 20%, transparent 20%),
                      radial-gradient(circle, #e50914 20%, transparent 20%),
                      radial-gradient(circle, transparent 10%, #e50914 15%, transparent 20%),
                      radial-gradient(circle, #e50914 20%, transparent 20%),
                      radial-gradient(circle, #e50914 20%, transparent 20%),
                      radial-gradient(circle, #e50914 20%, transparent 20%),
                      radial-gradient(circle, #e50914 20%, transparent 20%);
                    background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 20% 20%, 18% 18%;
                    background-position: 50% 0%;
                    animation: greenbottomBubbles 0.6s ease;
                  }
                  @keyframes greenbottomBubbles {
                    0% {
                      background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%,
                        70% -10%, 70% 0%;
                    }
                    50% {
                      background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%,
                        105% 0%;
                    }
                    100% {
                      background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%,
                        110% 10%;
                      background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
                    }
                  }
                `}</style>
                <button 
                  onClick={() => handleDelete(review.id)}
                  className="delete-btn"
                >
                  Smazat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}