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
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
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
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ textAlign: 'center', flex: 1 }}>Movie Database</h1>
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>Odhlásit</button>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button onClick={() => setActiveTab('movies')} style={{ fontWeight: activeTab === 'movies' ? 'bold' : 'normal' }}>Filmy</button>
          <button onClick={() => setActiveTab('watchlist')} style={{ fontWeight: activeTab === 'watchlist' ? 'bold' : 'normal' }}>Watchlist</button>
          <button onClick={() => setActiveTab('reviews')} style={{ fontWeight: activeTab === 'reviews' ? 'bold' : 'normal' }}>Moje recenze</button>
        </div>

        {activeTab === 'movies' && (
          <>
            <MovieForm onSuccess={() => setRefresh(refresh + 1)} />
            <MovieSearch onSearch={(title, genre, year) => setSearchParams({ title, genre, year })} />
            <MovieList key={refresh} userId={1} searchParams={searchParams} />
          </>
        )}
        {activeTab === 'watchlist' && <Watchlist />}
        {activeTab === 'reviews' && <MyReviews />}
      </div>
    </div>
  );
}

export default App;
