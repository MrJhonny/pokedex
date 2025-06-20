import React, { useState } from 'react';

export const typeColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

const PokemonCard = ({ pokemon, onClick }) => {
    const [imageSrc, setImageSrc] = useState(pokemon.sprites.front_default);

    const types = pokemon.types.map(t => t.type.name);
    const gradientBackground = types.length === 2
      ? `linear-gradient(120deg, ${typeColors[types[0]]} 45%, ${typeColors[types[1]]} 55%)`
      : typeColors[types[0]];

    return (
        <div
            className="card text-center h-100"
            onClick={() => onClick?.(pokemon)}
            style={{
                cursor: 'pointer',
                width: '100%',
                maxWidth: '250px',
                margin: '0 auto',
                background: gradientBackground,
                color: '#fff',
                border: '2px solid #fff',
                borderRadius: '10px'
            }}
        >
            <img
                src={imageSrc}
                alt={pokemon.name}
                className="card-img-top p-3"
                style={{ width: '100%', height: '150px', objectFit: 'contain' }}
                onMouseEnter={() => {
                    const baseName = pokemon.name.toLowerCase().split('-')[0];
                    setImageSrc(`https://projectpokemon.org/images/normal-sprite/${baseName}.gif`);
                }}
                onMouseLeave={() => setImageSrc(pokemon.sprites.front_default)}
            />
            <div className="card-body">
                <h5 className="card-title text-capitalize">{pokemon.name}</h5>
                <p className="card-text">N.º {pokemon.id}</p>
                <div>
                    {pokemon.types.map((t, idx) => (
                        <span
                          key={idx}
                          className="badge me-1"
                          style={{
                            backgroundColor: typeColors[t.type.name] || '#999',
                            color: '#fff',
                            border: '1px solid black',
                            padding: '2px 6px',
                            borderRadius: '8px'
                          }}
                        >
                            {t.type.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PokemonCard;

