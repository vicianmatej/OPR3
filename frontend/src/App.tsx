import { useState, useEffect } from 'react';
import MovieList from './components/MovieList';
import MovieForm from './components/MovieForm';
import MovieSearch from './components/MovieSearch';
import Login from './components/Login';
import Register from './components/Register';
import Watchlist from './components/Watchlist';
import MyReviews from './components/MyReviews';

function App() {
  const [refresh, setRefresh] = useState(0);
  const [searchParams, setSearchParams] = useState<{ title?: string; genre?: string; year?: number }>();
  const [token, setToken] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState<'movies' | 'watchlist' | 'reviews'>('movies');

  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return showRegister ? (
      <Register onRegister={setToken} onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onLogin={setToken} onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#141414',
      color: '#fff'
    }}>
      <nav style={{
        background: 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 100%)',
        padding: '20px 4%',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ 
            margin: 0, 
            color: '#e50914', 
            fontSize: '28px', 
            fontWeight: '900',
            letterSpacing: '1px'
          }}>CINEHUB</h1>
          
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            {[
              { key: 'movies', label: 'Filmy' },
              { key: 'watchlist', label: 'Můj seznam' },
              { key: 'reviews', label: 'Recenze' }
            ].map((tab) => (
              <button 
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)} 
                style={{ 
                  background: 'none',
                  border: 'none',
                  color: activeTab === tab.key ? '#fff' : '#e5e5e5',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.key ? '700' : '400',
                  transition: 'color 0.4s',
                  padding: '8px 0',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab.key) e.target.style.color = '#b3b3b3';
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab.key) e.target.style.color = '#e5e5e5';
                }}
              >
                {tab.label}
              </button>
            ))}
            
            <button 
              onClick={handleLogout} 
              style={{ 
                padding: '10px 20px',
                background: 'linear-gradient(45deg, #e50914, #f40612)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px 0 rgba(229, 9, 20, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px 0 rgba(229, 9, 20, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px 0 rgba(229, 9, 20, 0.3)';
              }}
            >
              Odhlásit se
            </button>
          </div>
        </div>
      </nav>

      <div style={{ padding: '40px 4%' }}>
        {activeTab === 'movies' && (
          <>
            <MovieSearch onSearch={(title, genre, year) => setSearchParams({ title, genre, year })} />
            <MovieList key={refresh} userId={1} searchParams={searchParams} />
            <MovieForm onSuccess={() => setRefresh(refresh + 1)} />
          </>
        )}
        {activeTab === 'watchlist' && <Watchlist />}
        {activeTab === 'reviews' && <MyReviews />}
      </div>
    </div>
  );
}

export default App;