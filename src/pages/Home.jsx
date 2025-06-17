import PokemonBigCard from '../components/PokemonBigCard';
import { useEffect, useState } from 'react';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

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

  const handleSearch = (query) => {
    const filtered = pokemonList.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.id.toString() === query
    );
    setFilteredList(filtered);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Pokédex Didáctica</h1>
      {error ? (
        <div className="text-center text-danger fw-bold">Error al cargar los datos.</div>
      ) : loading ? (
        <Loader />
      ) : (
        <>
          <SearchBar onSearch={handleSearch} />
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {filteredList.map(p => (
              <PokemonCard key={p.id} pokemon={p} onClick={() => setSelectedPokemon(p)} />
            ))}
          </div>
        </>
      )}
      {selectedPokemon && (
        <PokemonBigCard
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
};

export default Home;