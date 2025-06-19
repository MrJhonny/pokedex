import React, { useState } from 'react';
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

const Header = ({ searchQuery, setSearchQuery, onTypeFilterChange }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
      <a className="navbar-brand ms-3" href="#">Pokedex</a>
      <div className="d-flex justify-content-between align-items-center w-100 px-3">
        <div></div>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="filtersDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filters
          </button>
          <ul className="dropdown-menu dropdown-menu-end p-2" aria-labelledby="filtersDropdown" style={{ minWidth: '200px' }}>
            <li className="dropdown-header">Types</li>
            <li className="text-center mb-2">
              <button
                className="btn btn-sm btn-light"
                onClick={() => {
                  setSelectedTypes([]);
                  onTypeFilterChange([]);
                }}
              >
                Clear Selection
              </button>
            </li>
            {Object.entries(typeColors).map(([type, color]) => (
              <li
                key={type}
                className="form-check d-flex align-items-center mb-2"
                style={{
                  backgroundColor: color,
                  padding: '8px 12px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  gap: '10px',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  value={type}
                  id={`type-${type}`}
                  checked={selectedTypes.includes(type)}
                  onChange={(e) => {
                    const updatedTypes = e.target.checked
                      ? [...selectedTypes, type]
                      : selectedTypes.filter(t => t !== type);
                    setSelectedTypes(updatedTypes);
                    onTypeFilterChange(updatedTypes);
                  }}
                  style={{
                    transform: 'scale(1.3)',
                    cursor: 'pointer'
                  }}
                />
                <label
                  className="form-check-label text-white d-flex align-items-center"
                  htmlFor={`type-${type}`}
                  style={{
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%'
                  }}
                >
                  <img
                    src={typeIcons[type]}
                    alt={`${type} icon`}
                    style={{
                      width: '22px',
                      height: '22px',
                      filter: 'brightness(0) invert(1)'
                    }}
                  />
                  <span style={{ flexGrow: 1 }}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="d-flex align-items-center">
          {searchVisible && (
            <form className="d-flex me-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          )}
          <button className="btn btn-outline-light" onClick={toggleSearch}>
            🔍
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;