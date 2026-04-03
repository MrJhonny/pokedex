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
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem('team');
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
    localStorage.setItem('team', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    const openHelp = () => setShowHelpPage(true);
    window.addEventListener('openHelp', openHelp);
    return () => window.removeEventListener('openHelp', openHelp);
  }, []);

  const closeHelpPage = () => setShowHelpPage(false);

  const buildTeamEntry = (pokemon, isShiny) => {
    const shinySprite = pokemon.sprites?.other?.['official-artwork']?.front_shiny || pokemon.sprites?.front_shiny || '';
    const normalSprite =
      pokemon.sprites?.other?.['official-artwork']?.front_default ||
      pokemon.sprites?.front_default ||
      '';
    const baseStats = pokemon.stats.reduce((acc, stat) => {
      if (stat.stat.name === 'special-attack') {
        acc.specialAttack = stat.base_stat;
      } else if (stat.stat.name === 'special-defense') {
        acc.specialDefense = stat.base_stat;
      } else {
        acc[stat.stat.name] = stat.base_stat;
      }
      return acc;
    }, { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 });

    return {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map(t => t.type.name),
      isShiny: Boolean(isShiny),
      sprite: isShiny ? shinySprite : normalSprite,
      baseStats,
    };
  };

  const addToTeam = (pokemon, isShiny) => {
    if (!pokemon?.id) {
      return { ok: false, reason: 'invalid' };
    }
    if (team.some(member => member.id === pokemon.id)) {
      return { ok: false, reason: 'exists' };
    }
    if (team.length >= 6) {
      return { ok: false, reason: 'full' };
    }
    setTeam(prev => [...prev, buildTeamEntry(pokemon, isShiny)]);
    return { ok: true };
  };

  const removeFromTeam = (pokemonId) => {
    setTeam(prev => prev.filter(member => member.id !== pokemonId));
  };

  const clearTeam = () => {
    setTeam([]);
  };

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
                team={team}
                onRemoveFromTeam={removeFromTeam}
                onClearTeam={clearTeam}
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
              team={team}
              onAddToTeam={addToTeam}
              onRemoveFromTeam={removeFromTeam}
            />
            {!selectedPokemon && <UpArrow />}
          </div>
        </>
      )}
    </>
  );
}

export default App
