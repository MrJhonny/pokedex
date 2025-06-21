import React, { useEffect, useState } from 'react';
import { typeColors } from './PokemonCard';
import './PokemonBigCard.css';
import { FaTimes } from 'react-icons/fa';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Recibe props: pokemon (objeto), onClose (función), onNext (función), onPrev (función)
const PokemonBigCard = ({ pokemon, onClose, onNext, onPrev }) => {
  if (!pokemon) return null;

  const [showShiny, setShowShiny] = useState(false);
  const [description, setDescription] = useState('');
  const [evolutions, setEvolutions] = useState([]);

  useEffect(() => {
    const event = new CustomEvent('bigcard-toggle', { detail: true });
    window.dispatchEvent(event);
    document.body.classList.add('bigcard-open');
    document.body.classList.add('hide-uparrow');
    return () => {
      const event = new CustomEvent('bigcard-toggle', { detail: false });
      window.dispatchEvent(event);
      document.body.classList.remove('bigcard-open');
      document.body.classList.remove('hide-uparrow');
    };
  }, []);

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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    // Fetch species data for description and evolution chain url
    const fetchSpeciesAndEvolution = async () => {
      try {
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
        const speciesData = await speciesRes.json();

        // Find English flavor text
        const flavorEntry = speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === 'en'
        );
        setDescription(flavorEntry ? flavorEntry.flavor_text.replace(/\f/g, ' ') : '');

        // Fetch evolution chain
        if (speciesData.evolution_chain && speciesData.evolution_chain.url) {
          const evoChainRes = await fetch(speciesData.evolution_chain.url);
          const evoChainData = await evoChainRes.json();

          // Parse evolution chain recursively
          const evoNames = [];
          const traverseChain = (chain) => {
            if (!chain) return;
            evoNames.push(chain.species.name);
            if (chain.evolves_to && chain.evolves_to.length > 0) {
              chain.evolves_to.forEach((evo) => traverseChain(evo));
            }
          };
          traverseChain(evoChainData.chain);

          // Fetch pokemon data for each evolution to get image
          const evoData = await Promise.all(
            evoNames.map(async (name) => {
              const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
              const data = await res.json();
              return {
                name,
                image: data.sprites?.other?.['official-artwork']?.front_default || data.sprites.front_default,
                id: data.id,
              };
            })
          );
          setEvolutions(evoData);
        }
      } catch (error) {
        console.error('Error fetching species or evolution data:', error);
      }
    };

    fetchSpeciesAndEvolution();
  }, [pokemon.id]);

  const baseName = pokemon.name.toLowerCase().split('-')[0];
  const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${baseName}.mp3`;

  const statsLabels = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
  const statsData = statsLabels.map((label) => {
    const statObj = pokemon.stats.find((s) => s.stat.name === label);
    return statObj ? statObj.base_stat : 0;
  });

  const data = {
    labels: statsLabels.map((label) => label.replace('-', ' ')),
    datasets: [
      {
        data: statsData,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 206, 86, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 150,
        ticks: {
          stepSize: 30,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 100000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="modal-content position-relative" style={{ zIndex: 100001, position: 'relative' }} onClick={e => e.stopPropagation()}>
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
        <h2 className="text-capitalize text-center mt-3">{pokemon.name}</h2>
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
        {/* New section for description, radar chart and evolutions */}
        <div className="mt-4">
          {description && (
            <p style={{ whiteSpace: 'pre-line' }}><strong>Description:</strong> {description}</p>
          )}
          <div style={{ height: 300, maxWidth: 400, margin: '0 auto' }}>
            <Radar data={data} options={options} />
          </div>
          {evolutions.length > 0 && (
            <div className="d-flex justify-content-center align-items-center mt-3 flex-wrap evolution-chain" style={{ gap: '0.5rem' }}>
              {evolutions.map((evo, index) => (
                <React.Fragment key={evo.id}>
                  <div className="text-center" style={{ cursor: 'default' }}>
                    <img
                      src={evo.image}
                      alt={evo.name}
                      title={evo.name}
                      style={{ width: 60, height: 60, objectFit: 'contain' }}
                    />
                    <div className="text-capitalize" style={{ fontSize: '0.8rem' }}>{evo.name}</div>
                  </div>
                  {index < evolutions.length - 1 && (
                    <div style={{ fontSize: '1.5rem' }}>➤</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
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