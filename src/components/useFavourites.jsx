import { useEffect, useState } from 'react';

export function useFavourites(pokemonId) {
  const [isFavourite, setIsFavourite] = useState(false);
  const [favourites, setFavourites] = useState([]);

  const loadFavourites = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('favourites')) || [];
      setFavourites(stored);
      return stored;
    } catch (error) {
      console.error('Failed to load favourites from localStorage', error);
      setFavourites([]);
      return [];
    }
  };

  useEffect(() => {
    const stored = loadFavourites();
    if (pokemonId !== undefined) {
      setIsFavourite(stored.includes(pokemonId));
    }
  }, [pokemonId]);

  const toggleFavourite = () => {
    try {
      const stored = loadFavourites();
      let updatedList = [];

      if (stored.includes(pokemonId)) {
        updatedList = stored.filter((id) => id !== pokemonId);
        setIsFavourite(false);
      } else {
        updatedList = [...stored, pokemonId];
        setIsFavourite(true);
      }

      localStorage.setItem('favourites', JSON.stringify(updatedList));
      setFavourites(updatedList);
    } catch (error) {
      console.error('Failed to update favourites in localStorage', error);
    }
  };

  return { isFavourite, toggleFavourite, favourites, refreshFavourites: loadFavourites, setFavourites };
}
