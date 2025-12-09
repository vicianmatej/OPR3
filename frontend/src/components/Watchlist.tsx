import { useEffect, useState } from 'react';
import { watchlistApi } from '../services/api';

interface WatchlistItem {
  id: number;
  movieId: number;
  movieTitle: string;
  posterUrl?: string;
  watched: boolean;
  addedAt: string;
}

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

  const unwatchedCount = items.filter(item => !item.watched).length;
  const watchedCount = items.filter(item => item.watched).length;

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
          Můj seznam
        </h2>
        <div style={{ display: 'flex', gap: '20px', color: '#999', fontSize: '16px' }}>
          <span>{items.length} {items.length === 1 ? 'film' : items.length < 5 ? 'filmy' : 'filmů'}</span>
          {items.length > 0 && (
            <>
              <span>•</span>
              <span style={{ color: '#4CAF50' }}>{watchedCount} zhlédnuto</span>
              <span>•</span>
              <span style={{ color: '#FF9800' }}>{unwatchedCount} ke zhlédnutí</span>
            </>
          )}
        </div>
      </div>
      
      {items.length === 0 ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(0,0,0,0.3) 100%)',
          borderRadius: '16px',
          padding: '80px 40px',
          textAlign: 'center',
          border: '2px dashed rgba(229, 9, 20, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎬</div>
          <p style={{ color: '#fff', fontSize: '20px', marginBottom: '10px', fontWeight: '600' }}>
            Váš seznam je prázdný
          </p>
          <p style={{ color: '#999', fontSize: '16px', margin: 0 }}>
            Přidejte filmy, které chcete zhlédnout
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gap: '24px', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' 
        }}>
          {items.map(item => (
            <div 
              key={item.id} 
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: item.watched ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(255, 152, 0, 0.3)',
                boxShadow: item.watched ? '0 8px 32px rgba(76, 175, 80, 0.2)' : '0 8px 32px rgba(255, 152, 0, 0.2)',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = item.watched 
                  ? '0 16px 48px rgba(76, 175, 80, 0.4)' 
                  : '0 16px 48px rgba(255, 152, 0, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = item.watched 
                  ? '0 8px 32px rgba(76, 175, 80, 0.2)' 
                  : '0 8px 32px rgba(255, 152, 0, 0.2)';
              }}
            >
              {item.watched && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(76, 175, 80, 0.95)',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  ✓ Zhlédnuto
                </div>
              )}
              
              <div style={{ 
                width: '100%',
                height: '380px',
                background: item.posterUrl ? `url(${item.posterUrl})` : 'linear-gradient(135deg, #333 0%, #555 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.95))',
                  height: '120px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '20px'
                }}>
                  <h3 style={{ 
                    color: '#fff', 
                    margin: 0, 
                    fontSize: '20px',
                    fontWeight: '700',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                  }}>{item.movieTitle}</h3>
                </div>
              </div>
              
              <div style={{ padding: '20px' }}>

                  <p style={{ 
                    color: '#999', 
                    margin: '0 0 16px 0', 
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    Přidáno {new Date(item.addedAt).toLocaleDateString('cs-CZ', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  
                  <style>{`
                    .toggle-btn {
                      width: 100%;
                      padding: 12px;
                      margin-bottom: 12px;
                      border-radius: 10px;
                      border: none;
                      font-size: 14px;
                      font-weight: 600;
                      cursor: pointer;
                      position: relative;
                      overflow: hidden;
                      transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
                    }
                    .toggle-btn-watched {
                      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                      color: #fff;
                      box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
                    }
                    .toggle-btn-unwatched {
                      background: linear-gradient(135deg, #FF9800 0%, #f57c00 100%);
                      color: #fff;
                      box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
                    }
                    .toggle-btn:hover {
                      transform: translateY(-2px);
                    }
                    .toggle-btn-watched:hover {
                      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5);
                    }
                    .toggle-btn-unwatched:hover {
                      box-shadow: 0 6px 20px rgba(255, 152, 0, 0.5);
                    }
                    .toggle-btn:active {
                      transform: scale(0.95);
                    }
                    .toggle-btn::before {
                      content: '';
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      width: 0;
                      height: 0;
                      border-radius: 50%;
                      background: rgba(255, 255, 255, 0.3);
                      transform: translate(-50%, -50%);
                      transition: width 0.6s, height 0.6s;
                    }
                    .toggle-btn:hover::before {
                      width: 300px;
                      height: 300px;
                    }
                  `}</style>
                  <button
                    onClick={() => handleToggleWatched(item.movieId, item.watched)}
                    className={`toggle-btn ${item.watched ? 'toggle-btn-watched' : 'toggle-btn-unwatched'}`}
                  >
                    {item.watched ? '✓ Označit jako nezhlédnuté' : '○ Označit jako zhlédnuté'}
                  </button>
                  
                  <style>{`
                    .remove-btn {
                      width: 100%;
                      padding: 12px;
                      border: none;
                      border-radius: 10px;
                      font-size: 13px;
                      font-weight: 600;
                      cursor: pointer;
                      position: relative;
                      background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
                      color: #fff;
                      overflow: hidden;
                      transition: all 0.3s ease;
                      box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
                    }
                    .remove-btn::before {
                      content: '';
                      position: absolute;
                      top: 0;
                      left: -100%;
                      width: 100%;
                      height: 100%;
                      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                      transition: left 0.5s;
                    }
                    .remove-btn:hover::before {
                      left: 100%;
                    }
                    .remove-btn:hover {
                      transform: translateY(-2px);
                      box-shadow: 0 6px 20px rgba(229, 9, 20, 0.5);
                    }
                    .remove-btn:active {
                      transform: scale(0.95);
                    }
                  `}</style>
                  <button 
                    onClick={() => handleRemove(item.movieId)}
                    className="remove-btn"
                  >
                    Odebrat ze seznamu
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}