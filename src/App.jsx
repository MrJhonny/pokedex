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
          {/* <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> */}
          <Home searchQuery={searchQuery} />
        </>
      )}
    </>
  );
}

export default App
