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

  useEffect(() => {
    const getAllPokemon = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=386');
        const data = await res.json();

        const fullDetails = await Promise.all(
          data.results.map(pokemon =>
            fetch(pokemon.url).then(res => res.json())
          )
        );

        setPokemonList(fullDetails);
        setFilteredList(fullDetails);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los Pokémon:', err);
        setError(true);
        setLoading(false);
      }
    };

    getAllPokemon();
  }, []);

  useEffect(() => {
    const filtered = pokemonList.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          <div
            className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"
            style={{ display: 'flex', flexWrap: 'wrap' }}
          >
            {filteredList.map(p => (
              <div key={p.id} className="col">
                <PokemonCard pokemon={p} onClick={() => setSelectedPokemon(p)} />
              </div>
            ))}
          </div>
        )}
        
        {selectedPokemon && (
          <PokemonBigCard
            pokemon={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Home;