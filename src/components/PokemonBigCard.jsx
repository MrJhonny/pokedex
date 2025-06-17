import React from 'react';
import './PokemonBigCard.css'; // opcional para estilos personalizados

const PokemonBigCard = ({ pokemon, onClose }) => {
  if (!pokemon) return null;

  const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemon.name.toLowerCase()}.mp3`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="btn btn-danger btn-sm float-end" onClick={onClose}>Cerrar</button>
        <h2>{pokemon.name}</h2>
        <img src={pokemon.sprites?.other?.['official-artwork']?.front_default} alt={pokemon.name} />
        <p><strong>Altura:</strong> {pokemon.height}</p>
        <p><strong>Peso:</strong> {pokemon.weight}</p>
        <p><strong>Tipos:</strong> {pokemon.types.map(t => t.type.name).join(', ')}</p>
        <p><strong>Habilidades:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
        <audio controls src={cryUrl}>
          Tu navegador no admite audio.
        </audio>
      </div>
    </div>
  );
};

export default PokemonBigCard;