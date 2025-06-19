import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header';
import Home from './pages/Home';
import Loader from './components/Loader';

function App() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 2 segundos

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ position: 'sticky', top: 0, zIndex: 999 }}>
              <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
            <Home searchQuery={searchQuery} />
            <div style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000,
              backgroundColor: '#ffc107',
              padding: '10px',
              borderRadius: '10px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img src="/pikachu-jumping.gif" alt="Pikachu" style={{ width: '50px', marginBottom: '5px' }} />
              <div style={{ fontWeight: 'bold' }}>Ir Arriba</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App
