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

const Header = ({ searchQuery, setSearchQuery, onTypeFilterChange, bigCardOpen }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const sidebarRef = useRef(null);

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
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSidebar]);

  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-dark bg-dark`} style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: bigCardOpen ? 1 : 1000, pointerEvents: bigCardOpen ? 'none' : 'auto' }}>
        <a className="navbar-brand ms-3" href="#">Pokedex</a>
        <div className="d-flex justify-content-between align-items-center w-100 px-3">
          <div></div>
          <button
            className="btn btn-outline-light"
            onClick={() => setShowSidebar(true)}
          >
            ☰
          </button>
        </div>
      </nav>
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
          boxShadow: '-2px 0 5px rgba(0,0,0,0.5)'
        }}
      >
        <button
          className="btn btn-sm btn-outline-light mb-3"
          onClick={() => setShowSidebar(false)}
        >
          Close ✖
        </button>
        <div className="mb-3">
          <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        <div>
          <h5 className="mb-3">Types</h5>
          <button
            className="btn btn-sm btn-light mb-2"
            onClick={() => {
              setSelectedTypes([]);
              onTypeFilterChange([]);
            }}
          >
            Clear selection
          </button>
          <div
            className="d-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(6, auto)',
              gap: '10px'
            }}
          >
            {Object.entries(typeColors).map(([type, color]) => (
              <div
                key={type}
                className={`form-check d-flex justify-content-center align-items-center type-filter ${selectedTypes.includes(type) ? 'selected' : ''}`}
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
                  transform: selectedTypes.includes(type) ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  className="form-check-input"
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
                    display: 'none'
                  }}
                />
                <label
                  htmlFor={`type-${type}`}
                  style={{
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={typeIcons[type]}
                    alt={`${type} icon`}
                    style={{
                      width: '30px',
                      height: '30px',
                      filter: 'brightness(0) invert(1)'
                    }}
                  />
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