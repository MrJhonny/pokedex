import PokemonBigCard from '../components/PokemonBigCard';
import { useEffect, useState } from 'react';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';
import Header from '../components/Header';

import './Home.css'; // opcional para estilos personalizados

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(null);

  useEffect(() => {
    const loadInitialPokemon = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0');
        const data = await res.json();
        setTotalCount(data.count);
        const fullDetails = await Promise.all(
          data.results.map(p => fetch(p.url).then(res => res.json()))
        );
        setPokemonList(fullDetails);
        setFilteredList(fullDetails);
        setLoading(false);
        setOffset(100);
      } catch (err) {
        console.error('Error al cargar los Pokémon:', err);
        setError(true);
        setLoading(false);
      }
    };

    loadInitialPokemon();
  }, []);

  useEffect(() => {
    const filtered = pokemonList.filter(p =>
      p.name.split('-')[0].toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toString().includes(searchQuery)
    );
    setFilteredList(filtered);
  }, [searchQuery, pokemonList]);

  return (
    <div className="home-wrapper">
      <div className="pokedex-bg-image"></div>
      <div className="container mt-4 position-relative z-1">

        {error ? (
          <div className="text-center text-danger fw-bold">Error al cargar los datos.</div>
        ) : loading ? (
          <Loader />
        ) : (
          <div className="row g-4">
            {filteredList.map(p => (
              <div key={p.id} className="col-6 col-md-3 d-flex card-container">
                <div className="w-100 d-flex align-items-stretch">
                  <PokemonCard pokemon={p} onClick={() => setSelectedPokemon(p)} />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {selectedPokemon && (
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
        )}

        {totalCount && offset < totalCount && !loading && (
          <div className="text-center my-4">
            <button
              className="btn btn-primary"
              onClick={async () => {
                setLoadingMore(true);
                try {
                  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100&offset=${offset}`);
                  const data = await res.json();
                  const newDetails = await Promise.all(
                    data.results.map(p => fetch(p.url).then(res => res.json()))
                  );
                  const newList = [...pokemonList, ...newDetails];
                  setPokemonList(newList);
                  setFilteredList(newList);
                  setOffset(offset + 100);
                } catch (err) {
                  console.error('Error al cargar más Pokémon:', err);
                }
                setLoadingMore(false);
              }}
            >
              {loadingMore ? 'Cargando...' : 'Ver más'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;