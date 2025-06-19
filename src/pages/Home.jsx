import PokemonBigCard from '../components/PokemonBigCard';
import { useEffect, useState } from 'react';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';

import './Home.css'; // opcional para estilos personalizados

const Home = ({ searchQuery }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(null);

  useEffect(() => {
    const loadPokemonBatch = async (batchOffset) => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100&offset=${batchOffset}`);
        const data = await res.json();
        if (totalCount === null) setTotalCount(data.count);
        const fullDetails = await Promise.all(
          data.results.map(p => fetch(p.url).then(res => res.json()))
        );
        setPokemonList(prev => [...prev, ...fullDetails]);
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
    if (!searchQuery.trim()) {
      setFilteredList(pokemonList);
      return;
    }

    const filtered = pokemonList.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toString().includes(searchQuery)
    );
    setFilteredList(filtered);
  }, [searchQuery, pokemonList]);

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
            setPokemonList(prev => [...prev, ...newDetails]);
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

  return (
    <>
      <div className="home-wrapper" style={{ paddingTop: '60px' }}>
        <div className="pokedex-bg-image"></div>
        <div className="container mt-4 position-relative">

        {error ? (
          <div className="text-center text-danger fw-bold">Error al cargar los datos.</div>
        ) : loading ? (
          <Loader />
        ) : (
          <div className="d-flex flex-wrap justify-content-center gap-4">
            {filteredList.map(p => (
              <div key={p.id} style={{ width: '200px' }}>
                <PokemonCard pokemon={p} onClick={() => setSelectedPokemon(p)} />
              </div>
            ))}
          </div>
        )}
        
        {selectedPokemon && (
          <div style={{ zIndex: 1050, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
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
    </>
  );
};

export default Home;