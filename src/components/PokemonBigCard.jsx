import React, { useEffect, useState } from 'react';
import { typeColors } from './PokemonCard';
import './PokemonBigCard.css';
import { FaTimes } from 'react-icons/fa';

// Recibe props: pokemon (objeto), onClose (función), onNext (función), onPrev (función)
const PokemonBigCard = ({ pokemon, onClose, onNext, onPrev }) => {
  if (!pokemon) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        onPrev && onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext && onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPrev, onNext]);

  const [showShiny, setShowShiny] = useState(false);

  const baseName = pokemon.name.toLowerCase().split('-')[0];
  const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${baseName}.mp3`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content position-relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="position-absolute top-0 end-0 m-3 btn btn-link text-dark fs-4" aria-label="Close">
          <FaTimes />
        </button>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            transform: 'translateY(-50%)',
            display: 'flex',
            justifyContent: 'space-between',
            pointerEvents: 'none',
            zIndex: 10,
            padding: '0 1rem',
          }}
        >
          <button
            className="btn btn-outline-dark"
            onClick={(e) => {
              e.stopPropagation();
              onPrev && onPrev();
            }}
            style={{ pointerEvents: 'auto' }}
          >
            &larr;
          </button>
          <button
            className="btn btn-outline-dark"
            onClick={(e) => {
              e.stopPropagation();
              onNext && onNext();
            }}
            style={{ pointerEvents: 'auto' }}
          >
            &rarr;
          </button>
        </div>
        {/* <h2>{pokemon.name}</h2> */}
        <div className="text-center mb-3">
          <button className="btn btn-warning" onClick={() => setShowShiny(!showShiny)}>
            {showShiny ? 'Ver Normal' : 'Ver Shiny'}
          </button>
        </div>
        <img
          src={
            showShiny
              ? pokemon.sprites?.other?.['official-artwork']?.front_shiny
              : pokemon.sprites?.other?.['official-artwork']?.front_default
          }
          alt={pokemon.name}
        />
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