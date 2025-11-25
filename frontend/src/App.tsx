import { useState, useEffect } from 'react';
import MovieList from './components/MovieList';
import MovieForm from './components/MovieForm';
import MovieSearch from './components/MovieSearch';
import Login from './components/Login';

function App() {
  const [refresh, setRefresh] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<{ title?: string; genre?: string; year?: number }>();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Movie Database</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>Odhlásit</button>
      </div>
      <MovieForm onSuccess={() => setRefresh(refresh + 1)} />
      <MovieSearch onSearch={(title, genre, year) => setSearchParams({ title, genre, year })} />
      <MovieList key={refresh} userId={1} searchParams={searchParams} />
    </div>
  );
}

export default App;
