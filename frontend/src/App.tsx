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
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setToken(null);
  };

  const isAdmin = localStorage.getItem('userRole') === 'ADMIN';
  const userEmail = localStorage.getItem('userEmail') || '';
  const username = userEmail.split('@')[0];

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
      background: '#0a0a0a',
      color: '#fff'
    }}>
      <nav style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
        padding: '20px 4%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '28px', 
            fontWeight: '900',
            letterSpacing: '1px'
          }}>
            <span style={{ color: '#e50914' }}>CINE</span>
            <span style={{ color: '#fff' }}>HUB</span>
          </h1>
          
          <div style={{ display: 'flex', gap: '24px' }}>
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
                  color: activeTab === tab.key ? '#fff' : '#999',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.key ? '600' : '400',
                  transition: 'color 0.3s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <span style={{ color: '#fff', fontSize: '14px' }}>{username}</span>
          <style>{`
            .logout-button {
              position: relative;
              padding: 12px 35px;
              background: #e50914;
              font-size: 14px;
              font-weight: 600;
              text-decoration: none;
              text-transform: uppercase;
              overflow: hidden;
              transition: 0.5s;
              letter-spacing: 1px;
              border-radius: 8px;
              border: none;
              color: #fff;
              cursor: pointer;
            }
            .logout-button:hover {
              background: #e50914;
              color: #fff;
              box-shadow: 0 0 5px #e50914, 0 0 25px #e50914, 0 0 50px #e50914, 0 0 100px #e50914;
            }
            .logout-button span {
              position: absolute;
              display: block;
            }
            .logout-button span:nth-child(1) {
              top: 0;
              left: -100%;
              width: 100%;
              height: 2px;
              background: linear-gradient(90deg, transparent, #e50914);
              animation: btn-anim1 1.5s linear infinite;
            }
            @keyframes btn-anim1 {
              0% {
                left: -100%;
              }
              50%, 100% {
                left: 100%;
              }
            }
            .logout-button span:nth-child(2) {
              top: -100%;
              right: 0;
              width: 2px;
              height: 100%;
              background: linear-gradient(180deg, transparent, #e50914);
              animation: btn-anim2 1.5s linear infinite;
              animation-delay: 0.375s;
            }
            @keyframes btn-anim2 {
              0% {
                top: -100%;
              }
              50%, 100% {
                top: 100%;
              }
            }
            .logout-button span:nth-child(3) {
              bottom: 0;
              right: -100%;
              width: 100%;
              height: 2px;
              background: linear-gradient(270deg, transparent, #e50914);
              animation: btn-anim3 1.5s linear infinite;
              animation-delay: 0.75s;
            }
            @keyframes btn-anim3 {
              0% {
                right: -100%;
              }
              50%, 100% {
                right: 100%;
              }
            }
            .logout-button span:nth-child(4) {
              bottom: -100%;
              left: 0;
              width: 2px;
              height: 100%;
              background: linear-gradient(360deg, transparent, #e50914);
              animation: btn-anim4 1.5s linear infinite;
              animation-delay: 1.125s;
            }
            @keyframes btn-anim4 {
              0% {
                bottom: -100%;
              }
              50%, 100% {
                bottom: 100%;
              }
            }
          `}</style>
          <button onClick={handleLogout} className="logout-button">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Odhlásit se
          </button>
        </div>
      </nav>

      <div style={{ paddingTop: '80px' }}>
        {activeTab === 'movies' && (
          <>
            <MovieSearch onSearch={(title, genre, year) => setSearchParams({ title, genre, year })} />
            <MovieList key={refresh} userId={1} searchParams={searchParams} onClearSearch={() => setSearchParams(undefined)} />
            {isAdmin && <MovieForm onSuccess={() => setRefresh(refresh + 1)} />}
          </>
        )}
        {activeTab === 'watchlist' && <Watchlist />}
        {activeTab === 'reviews' && <MyReviews />}
      </div>
    </div>
  );
}

export default App;