import React, { useEffect, useState } from 'react';
import { typeColors } from './PokemonCard';
import './PokemonBigCard.css';
import { FaTimes, FaHeart, FaRegHeart } from 'react-icons/fa';
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
  const [isFavourite, setIsFavourite] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('favourites') || '[]');
    return pokemon?.id ? stored.includes(pokemon.id) : false;
  });

  // Cargar favoritos desde localStorage al montar o cambiar pokemon
  useEffect(() => {
    if (!pokemon?.id) return;

    const storedFavourites = JSON.parse(localStorage.getItem('favourites') || '[]');
    setIsFavourite(storedFavourites.includes(pokemon.id));
    console.log('Check if favourite:', pokemon.id);
  }, [pokemon?.id]);

  // Actualizar localStorage cuando cambia isFavourite
  useEffect(() => {
    const storedFavourites = JSON.parse(localStorage.getItem('favourites') || '[]');
    if (isFavourite && !storedFavourites.includes(pokemon.id)) {
      localStorage.setItem('favourites', JSON.stringify([...storedFavourites, pokemon.id]));
    } else if (!isFavourite && storedFavourites.includes(pokemon.id)) {
      localStorage.setItem('favourites', JSON.stringify(storedFavourites.filter(id => id !== pokemon.id)));
    }
  }, [isFavourite, pokemon.id]);

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
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  // Efecto para detectar deslizamiento hacia abajo en modal-content
  useEffect(() => {
    const modal = document.querySelector('.modal-content');
    if (!modal) return;

    let startY = 0;
    let currentY = 0;
    let threshold = 500;
    let direction = null;
    let startX = 0;
    let currentX = 0;

    const onTouchStart = (e) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      modal.style.transition = 'none';
      direction = null;
    };

    const onTouchMove = (e) => {
      currentY = e.touches[0].clientY;
      currentX = e.touches[0].clientX;
      const deltaY = currentY - startY;
      const deltaX = currentX - startX;

      if (Math.abs(deltaY) > 10) {
        direction = deltaY > 0 ? 'down' : 'up';
        modal.style.top = `${deltaY}px`;
      }
    };

    const onTouchEnd = () => {
      const deltaY = currentY - startY;
      const deltaX = currentX - startX;
      modal.style.transition = 'top 0.3s ease';

      if (direction && Math.abs(deltaY) > threshold) {
        onClose(); // Solo cerrar si es gesto claro y con dirección
      } else if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onPrev && onPrev();
        } else {
          onNext && onNext();
        }
        modal.style.top = `0`;
      } else {
        modal.style.top = `0`;
      }
    };

    modal.addEventListener('touchstart', onTouchStart);
    modal.addEventListener('touchmove', onTouchMove);
    modal.addEventListener('touchend', onTouchEnd);

    return () => {
      modal.removeEventListener('touchstart', onTouchStart);
      modal.removeEventListener('touchmove', onTouchMove);
      modal.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 100000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="modal-content position-relative" style={{ zIndex: 100001, position: 'relative', transition: 'top 0.3s ease', top: 0, maxWidth: '700px', width: '85%', minHeight: '70vh' }} onClick={e => e.stopPropagation()}>
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

        <React.Fragment>
          {/* Título centrado solamente */}
          <div className="text-center mt-4 d-none d-md-block">
            <h2 className="text-capitalize">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} N°{pokemon.id}</h2>
            <div
              className="favourite-toggle mt-3"
              onClick={() => setIsFavourite(!isFavourite)}
              role="button"
              aria-label="Toggle Favourite"
              tabIndex="0"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                cursor: 'pointer',
                gap: '0.25rem',
              }}
            >
            <div
              className="favourite-icon-wrapper"
              style={{
                fontSize: '2.5rem',
                color: isFavourite ? '#f52755' : '#aaa',
                transition: 'all 0.3s ease',
                filter: isFavourite ? 'drop-shadow(0 0 6px rgba(245, 39, 85, 0.5))' : 'none',
                transform: isFavourite ? 'scale(1.2)' : 'scale(1)',
              }}
            >
                {isFavourite ? <FaHeart /> : <FaRegHeart />}
              </div>
              <div
                style={{
                  fontSize: '0.9rem',
                  color: isFavourite ? '#f52755' : '#666',
                  opacity: 1,
                }}
              >
                {isFavourite ? `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} added to favourites!` : `Click to add ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} to favourites`}
              </div>
            </div>
          </div>

          {/* Grid 2x2 */}
          <div className="d-none d-md-grid px-md-0" style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gridTemplateRows: 'auto auto',
            gap: '1.5rem',
            marginTop: '1.5rem'
          }}>
            {/* 1. Imagen y botón Ver Shiny */}
            <div style={{ gridColumn: '1 / 2', gridRow: '1 / 2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <h5 className="text-center mb-2">Image</h5>
              <img
                src={
                  showShiny
                    ? pokemon.sprites?.other?.['official-artwork']?.front_shiny
                    : pokemon.sprites?.other?.['official-artwork']?.front_default
                }
                alt={pokemon.name}
                style={{ maxWidth: '200px' }}
              />
              <div className="mt-2">
                <button className="btn btn-warning" onClick={() => setShowShiny(!showShiny)}>
                  {showShiny ? 'See Normal' : 'See Shiny'}
                </button>
              </div>
            </div>

            {/* 2. Características */}
            <div style={{ gridColumn: '2 / 3', gridRow: '1 / 2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <h5 className="text-center mb-2">Characteristics</h5>
              <p style={{ textAlign: 'center' }}><strong>Height:</strong> {(pokemon.height / 10).toFixed(1)} m</p>
              <p style={{ textAlign: 'center' }}><strong>Weight:</strong> {(pokemon.weight / 10).toFixed(1)} kg</p>
              <p style={{ textAlign: 'center' }}>
                <strong>Types:</strong> {pokemon.types.map(t => (
                  <span key={t.type.name} style={{ backgroundColor: typeColors[t.type.name], color: 'white', padding: '0.2em 0.5em', borderRadius: '0.5em', marginRight: '0.5em' }}>
                    {t.type.name}
                  </span>
                ))}
              </p>
              <p style={{ textAlign: 'center' }}><strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
            </div>

            {/* 3. Descripción */}
            <div style={{ gridColumn: '1 / 2', gridRow: '2 / 3', whiteSpace: 'pre-line', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>
              <h5 className="text-center mb-2">Description</h5>
              {description && (
                <p style={{ textAlign: 'center' }}>
                  <strong>Description:</strong> {description}
                </p>
              )}
              {/* Evoluciones SOLO EN PC, DENTRO DE DESCRIPCIÓN */}
              {evolutions.length > 0 && (
                <>
                  <h5 className="text-center mb-2 d-none d-md-block">Evolution Line</h5>
                  <div className="d-none d-md-flex justify-content-center align-items-center mt-3 flex-wrap evolution-chain" style={{ gap: '0.5rem' }}>
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
                </>
              )}
            </div>

            {/* 4. Stats */}
            <div style={{ gridColumn: '2 / 3', gridRow: '2 / 3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: '1.5rem' }}>
              <h5 className="text-center mb-1" style={{ marginTop: '-0.25rem' }}>Stats</h5>
              <div style={{ height: 300, maxWidth: 300, margin: '0 auto' }}>
                <Radar data={data} options={options} />
              </div>
            </div>

            {/* Audio */}
            <div className="d-flex justify-content-center mt-3" style={{ gridColumn: '1 / -1' }}>
              <audio controls src={cryUrl}>
                Your browser does not support audio.
              </audio>
            </div>

            {/* Evoluciones */}
            {/* {evolutions.length > 0 && (
              <div className="d-flex justify-content-center align-items-center mt-3 flex-wrap evolution-chain" style={{ gap: '0.5rem', gridColumn: '1 / -1' }}>
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
            )} */}
          </div>

          {/* Layout mobile original */}
          <div className="d-md-none px-3">
            <h2 className="text-capitalize text-center mt-3">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <div className="text-center mb-3">
              <button className="btn btn-warning" onClick={() => setShowShiny(!showShiny)}>
                {showShiny ? 'See Normal' : 'See Shiny'}
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

            {description && (
              <p style={{ whiteSpace: 'pre-line' }}><strong>Description:</strong> {description}</p>
            )}
                        <div style={{ height: 300, maxWidth: 300, margin: '2rem auto' }}>
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
            <div className="d-flex justify-content-center mt-3">
              <audio controls src={cryUrl}>
                Your browser does not support audio.
              </audio>
            </div>
          </div>
        </React.Fragment>

      </div>
    </div>
  );
};

export default PokemonBigCard;