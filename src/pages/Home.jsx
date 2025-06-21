import PokemonBigCard from '../components/PokemonBigCard';
import { useEffect, useState } from 'react';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';
import LoaderMini from '../components/LoaderMini';

import './Home.css'; // opcional para estilos personalizados

const Home = ({ searchQuery, selectedTypes = [], selectedRegions = [], setSelectedRegions }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(null);

  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [inputSequence, setInputSequence] = useState('');

  const regionRanges = {
    kanto: [1, 151],
    johto: [152, 251],
    hoenn: [252, 386],
    sinnoh: [387, 493],
    unova: [494, 649],
    kalos: [650, 721],
    alola: [722, 809],
    galar: [810, 898],
    paldea: [899, 1010], // ejemplo, según generaciones
  };

  useEffect(() => {
    const loadPokemonBatch = async (batchOffset) => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100&offset=${batchOffset}`);
        const data = await res.json();
        if (totalCount === null) setTotalCount(data.count);
        const fullDetails = await Promise.all(
          data.results.map(p => fetch(p.url).then(res => res.json()))
        );
        setPokemonList(prev => {
          const combined = [...prev, ...fullDetails];
          const unique = Array.from(new Map(combined.map(p => [p.id, p])).values());
          return unique;
        });
        setFilteredList(prev => [...prev, ...fullDetails]);
        setOffset(prev => prev + 100);
      } catch (err) {
        console.error('Error al cargar los Pokémon:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadPokemonBatch(0);
  }, []);

  useEffect(() => {
    if (!pokemonList.length) return;

    let filtered = pokemonList;

    // Filtrar por nombre o id (searchQuery)
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toString().includes(searchQuery)
      );
    }

    // Filtrar por tipos (si hay)
    if (selectedTypes && selectedTypes.length > 0) {
      filtered = filtered.filter(p =>
        p.types.some(t => selectedTypes.includes(t.type.name))
      );
    }

    // Filtrar por regiones (si hay)
    if (selectedRegions && selectedRegions.length > 0) {
      const regionIds = selectedRegions.flatMap(region => {
        const range = regionRanges[region];
        if (!range) return [];
        const [minId, maxId] = range;
        return Array.from({ length: maxId - minId + 1 }, (_, i) => i + minId);
      });
      filtered = filtered.filter(p => regionIds.includes(p.id));
    }

    setFilteredList(filtered);
  }, [searchQuery, selectedTypes, selectedRegions, pokemonList]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        offset < totalCount &&
        !loadingMore
      ) {
        setLoadingMore(true);
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=100&offset=${offset}`)
          .then(res => res.json())
          .then(data => {
            return Promise.all(data.results.map(p => fetch(p.url).then(res => res.json())));
          })
          .then(newDetails => {
            setPokemonList(prev => {
              const combined = [...prev, ...newDetails];
              const unique = Array.from(new Map(combined.map(p => [p.id, p])).values());
              return unique;
            });
            setFilteredList(prev => [...prev, ...newDetails]);
            setOffset(prev => prev + 100);
          })
          .catch(err => {
            console.error('Error al cargar más Pokémon:', err);
          })
          .finally(() => {
            setLoadingMore(false);
          });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset, totalCount, loadingMore]);

  useEffect(() => {
    if (selectedPokemon) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [selectedPokemon]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      setInputSequence(prev => {
        const next = (prev + e.key).slice(-20); // limita largo
        if (next.toLowerCase().endsWith('opening')) {
          setShowEasterEgg(true);
          setInputSequence(''); // limpiar el input
        }
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showEasterEgg && !document.querySelector('.easter-iframe-wrapper')?.contains(e.target)) {
        setShowEasterEgg(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowEasterEgg(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showEasterEgg]);

  return (
    <div className={`page-wrapper ${selectedPokemon ? 'bigcard-open' : ''}`}>
      <div className={`home-wrapper ${selectedPokemon ? 'no-scroll' : ''}`} style={{ paddingTop: '60px' }}>
        <div className="pokedex-bg-image"></div>
        <div className="container mt-4 position-relative">

        {error ? (
          <div className="text-center text-danger fw-bold">Error al cargar los datos.</div>
        ) : loading ? (
          <Loader />
        ) : (
          <div className="pokemon-grid d-flex flex-wrap justify-content-center gap-4">
            {filteredList.map(p => (
              <div key={p.id} style={{ width: '200px' }}>
                <PokemonCard pokemon={p} onClick={() => setSelectedPokemon(p)} />
              </div>
            ))}
          </div>
        )}

        {loadingMore && (
          <div className="d-flex justify-content-center w-100 mt-4 mb-4">
            <div style={{ width: '80px', height: '80px' }}>
              <LoaderMini />
            </div>
          </div>
        )}
        
        {selectedPokemon && (
          <div style={{ zIndex: 1100, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
            <PokemonBigCard
              pokemon={selectedPokemon}
              onClose={() => setSelectedPokemon(null)}
              onPrev={() => {
                const currentIndex = filteredList.findIndex(p => p.id === selectedPokemon.id);
                if (currentIndex > 0) {
                  setSelectedPokemon(filteredList[currentIndex - 1]);
                }
              }}
              onNext={() => {
                const currentIndex = filteredList.findIndex(p => p.id === selectedPokemon.id);
                if (currentIndex < filteredList.length - 1) {
                  setSelectedPokemon(filteredList[currentIndex + 1]);
                }
              }}
            />
          </div>
        )}

        </div>
      </div>
      {showEasterEgg && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div className="easter-iframe-wrapper" style={{ position: 'relative', width: '90%', maxWidth: '800px' }}>
            <iframe
              width="100%"
              height="450"
              src="https://www.youtube.com/embed/6xKWiCMKKJg?autoplay=1"
              title="YouTube video player"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
            <button
              onClick={() => setShowEasterEgg(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '28px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
              }}
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;