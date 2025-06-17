import React from 'react';
import { typeColors } from './PokemonCard';
import './PokemonBigCard.css';

const PokemonBigCard = ({ pokemon, onClose }) => {
  if (!pokemon) return null;

  const baseName = pokemon.name.toLowerCase().split('-')[0];
  const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${baseName}.mp3`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="btn btn-danger btn-sm float-end" onClick={onClose}>Close</button>
        <h2>{pokemon.name}</h2>
        <img src={pokemon.sprites?.other?.['official-artwork']?.front_default} alt={pokemon.name} />
        <p><strong>Height:</strong> {(pokemon.height / 10).toFixed(1)} m</p>
        <p><strong>Weight:</strong> {(pokemon.weight / 10).toFixed(1)} kg</p>
        <p><strong>Types:</strong> {pokemon.types.map(t => (
          <span key={t.type.name} style={{ backgroundColor: typeColors[t.type.name], color: 'white', padding: '0.2em 0.5em', borderRadius: '0.5em', marginRight: '0.5em' }}>
            {t.type.name}
          </span>
        ))}</p>
        <p><strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
        <div className="d-flex justify-content-center mt-3">
          <audio controls src={cryUrl}>
            Your browser does not support audio.
          </audio>
        </div>
      </div>
    </div>
  );
};

export default PokemonBigCard;