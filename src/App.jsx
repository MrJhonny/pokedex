import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header';
import Home from './pages/Home';
import Loader from './components/Loader';
import UpArrow from './components/UpArrow';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Page from './components/Page';

function App() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem('favourites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHelpPage, setShowHelpPage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 2 segundos

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  useEffect(() => {
    const openHelp = () => setShowHelpPage(true);
    window.addEventListener('openHelp', openHelp);
    return () => window.removeEventListener('openHelp', openHelp);
  }, []);

  const closeHelpPage = () => setShowHelpPage(false);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {showHelpPage && (
            <div className="modal-overlay">
              <Page onClose={closeHelpPage} />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div className={`header-wrapper ${selectedPokemon ? 'behind-bigcard' : ''}`} style={selectedPokemon ? { pointerEvents: 'none' } : {}}>
              <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedPokemon={selectedPokemon}
                setSelectedPokemon={setSelectedPokemon}
                onTypeFilterChange={setFilteredTypes}
                setSelectedRegions={setSelectedRegions}
                onToggleFavouritesFilter={setShowFavouritesOnly}
                showFavouritesOnly={showFavouritesOnly}
                favourites={favourites}
              />
            </div>
            <Home
              searchQuery={searchQuery}
              selectedPokemon={selectedPokemon}
              setSelectedPokemon={setSelectedPokemon}
              selectedTypes={filteredTypes}
              selectedRegions={selectedRegions}
              setSelectedRegions={setSelectedRegions}
              showFavouritesOnly={showFavouritesOnly}
              favourites={favourites}
              setFavourites={setFavourites}
            />
            {!selectedPokemon && <UpArrow />}
          </div>
        </>
      )}
    </>
  );
}

export default App
