// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import bugIcon from '../assets/bug.svg';
import darkIcon from '../assets/dark.svg';
import dragonIcon from '../assets/dragon.svg';
import electricIcon from '../assets/electric.svg';
import fairyIcon from '../assets/fairy.svg';
import fightingIcon from '../assets/fighting.svg';
import fireIcon from '../assets/fire.svg';
import flyingIcon from '../assets/flying.svg';
import ghostIcon from '../assets/ghost.svg';
import grassIcon from '../assets/grass.svg';
import groundIcon from '../assets/ground.svg';
import iceIcon from '../assets/ice.svg';
import normalIcon from '../assets/normal.svg';
import poisonIcon from '../assets/poison.svg';
import psychicIcon from '../assets/psychic.svg';
import rockIcon from '../assets/rock.svg';
import steelIcon from '../assets/steel.svg';
import waterIcon from '../assets/water.svg';

const typeIcons = {
  normal: normalIcon,
  fire: fireIcon,
  water: waterIcon,
  electric: electricIcon,
  grass: grassIcon,
  ice: iceIcon,
  fighting: fightingIcon,
  poison: poisonIcon,
  ground: groundIcon,
  flying: flyingIcon,
  psychic: psychicIcon,
  bug: bugIcon,
  rock: rockIcon,
  ghost: ghostIcon,
  dragon: dragonIcon,
  dark: darkIcon,
  steel: steelIcon,
  fairy: fairyIcon,
};

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

const Header = ({
  searchQuery,
  setSearchQuery,
  onTypeFilterChange,
  setSelectedRegions,
  bigCardOpen
}) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedRegionsInternal, setSelectedRegionsInternal] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const sidebarRef = useRef(null);

  // Random phrases
  const phrases = [
    "I choose you!",
    "Gotta catch 'em all!",
    "Pikachu, Thunderbolt!",
    "It's super effective!",
    "Team Rocket's blasting off again!",
    "Believe in the heart of your Pokémon!",
    "Battle hard, train harder!",
    "Pokémon, let's go!",
    "Ash, we're counting on you!",
    "Eevee, use Quick Attack!"
  ];
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

  // Close sidebar on click outside or ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowSidebar(false);
      }
    };
    if (showSidebar) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showSidebar]);

  // Responsive font size for title
  const pokedexTitleStyle = {
    fontSize: '1.25rem',
  };
  const smallScreenStyle =
    typeof window !== 'undefined' && window.innerWidth < 576
      ? { fontSize: '1rem' }
      : {};

  // Handle type filter toggle
  const toggleType = (type) => {
    let updated;
    if (selectedTypes.includes(type)) {
      updated = selectedTypes.filter(t => t !== type);
    } else {
      updated = [...selectedTypes, type];
    }
    setSelectedTypes(updated);
    onTypeFilterChange(updated);
  };

  // Handle region filter toggle
  const toggleRegion = (region) => {
    let updated;
    if (selectedRegionsInternal.includes(region)) {
      updated = selectedRegionsInternal.filter(r => r !== region);
    } else {
      updated = [...selectedRegionsInternal, region];
    }
    setSelectedRegionsInternal(updated);
    setSelectedRegions(updated);
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark px-3 py-2"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: bigCardOpen ? 1 : 1000,
          pointerEvents: bigCardOpen ? 'none' : 'auto',
        }}
      >
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center w-100"
          style={{ height: '56px' }}
        >
          <div
            className="navbar-brand mb-0 h1"
            style={{ ...pokedexTitleStyle, ...smallScreenStyle }}
          >
            Pokedex
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ccc' }}>
            {randomPhrase}
          </div>
        </div>

        {/* Hamburger menu button */}
        <div className="position-absolute top-0 end-0 pe-2 d-flex align-items-center h-100">
          <button
            className="btn btn-outline-light"
            onClick={() => setShowSidebar(true)}
            aria-label="Toggle filters menu"
            aria-expanded={showSidebar}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Backdrop blur */}
      {showSidebar && (
        <div
          className="sidebar-backdrop"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1040,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`sidebar bg-dark text-white p-3 ${showSidebar ? 'show' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: '250px',
          zIndex: 1050,
          transform: showSidebar ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          boxShadow: '-2px 0 5px rgba(0,0,0,0.5)',
          overflowY: 'auto',
        }}
      >
        <button
          className="btn btn-sm btn-outline-light mb-3"
          onClick={() => setShowSidebar(false)}
        >
          Close ✖
        </button>

        <button
          className="btn btn-sm btn-danger mb-3 w-100"
          onClick={() => {
            setSelectedTypes([]);
            setSelectedRegionsInternal([]);
            setSelectedRegions([]);
            setSearchQuery('');
            onTypeFilterChange([]);
          }}
        >
          Reset Filters
        </button>

        {/* Search input */}
        <div className="mb-3">
          <form
            className="d-flex"
            onSubmit={e => e.preventDefault()}
            role="search"
            aria-label="Search Pokémon"
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search Pokémon by name or number"
            />
          </form>
        </div>

        {/* Types filter */}
        <div>
          <h5 className="mb-3">Types</h5>
          <div
            className="d-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(6, auto)',
              gap: '10px',
            }}
          >
            {Object.entries(typeColors).map(([type, color]) => (
              <div
                key={type}
                className={`form-check d-flex justify-content-center align-items-center type-filter ${
                  selectedTypes.includes(type) ? 'selected' : ''
                }`}
                style={{
                  backgroundColor: color,
                  padding: '12px',
                  borderRadius: '10px',
                  boxShadow: selectedTypes.includes(type)
                    ? '0 0 10px 4px rgba(255, 255, 255, 0.7)'
                    : '0 2px 4px rgba(0,0,0,0.2)',
                  outline: selectedTypes.includes(type)
                    ? '2px solid white'
                    : 'none',
                  transform: selectedTypes.includes(type)
                    ? 'scale(1.05)'
                    : 'scale(1)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onClick={() => toggleType(type)}
                role="checkbox"
                aria-checked={selectedTypes.includes(type)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleType(type);
                  }
                }}
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={type}
                  id={`type-${type}`}
                  checked={selectedTypes.includes(type)}
                  onChange={() => {}} // No-op because we handle onClick on the div
                  style={{ display: 'none' }}
                  tabIndex={-1}
                />
                <label
                  htmlFor={`type-${type}`}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={typeIcons[type]}
                    alt={`${type} icon`}
                    style={{
                      width: '30px',
                      height: '30px',
                      filter: 'brightness(0) invert(1)',
                      pointerEvents: 'none',
                    }}
                    draggable={false}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Regions filter */}
        <div className="mt-4">
          <h5 className="mb-3">Regions</h5>
          <div
            className="d-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, auto)',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {[
              'kanto',
              'johto',
              'hoenn',
              'sinnoh',
              'unova',
              'kalos',
              'alola',
              'galar',
              'paldea',
            ].map((region) => (
              <div
                key={region}
                className={`form-check text-center text-capitalize rounded-pill fw-bold shadow-sm ${
                  selectedRegionsInternal.includes(region)
                    ? 'bg-primary text-white border border-light'
                    : 'bg-light text-dark border border-secondary'
                }`}
                style={{
                  padding: '8px 12px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  userSelect: 'none',
                }}
                onClick={() => toggleRegion(region)}
                role="checkbox"
                aria-checked={selectedRegionsInternal.includes(region)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleRegion(region);
                  }
                }}
              >
                <input
                  type="checkbox"
                  id={`region-${region}`}
                  value={region}
                  checked={selectedRegionsInternal.includes(region)}
                  onChange={() => {}}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                />
                <label htmlFor={`region-${region}`} className="w-100">
                  {region}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;