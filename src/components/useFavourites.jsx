import { useEffect, useState } from 'react';

export function useFavourites(pokemonId) {
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favourites')) || [];
    setIsFavourite(stored.includes(pokemonId));
  }, [pokemonId]);

  const toggleFavourite = () => {
    setIsFavourite((prev) => {
      const updated = !prev;
      const stored = JSON.parse(localStorage.getItem('favourites')) || [];
      const updatedList = updated
        ? [...stored, pokemonId]
        : stored.filter((id) => id !== pokemonId);

      localStorage.setItem('favourites', JSON.stringify(updatedList));
      return updated;
    });
  };

  return { isFavourite, toggleFavourite };
}
