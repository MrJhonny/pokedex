// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import Page from './Page';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Header.css';

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
  bigCardOpen,
  onToggleFavouritesFilter,
  favourites,
  showFavouritesOnly,
  team = [],
  onRemoveFromTeam,
  onClearTeam
}) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedRegionsInternal, setSelectedRegionsInternal] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPageModal, setShowPageModal] = useState(false);
  const [activePanel, setActivePanel] = useState('filters');
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ivPokemonId, setIvPokemonId] = useState(team[0]?.id || '');
  const [ivLevel, setIvLevel] = useState(50);
  const [ivNature, setIvNature] = useState('Serious');
  const [ivEvs, setIvEvs] = useState({
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  });
  const [ivStats, setIvStats] = useState({
    hp: '',
    attack: '',
    defense: '',
    specialAttack: '',
    specialDefense: '',
    speed: '',
  });
  // const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);

  const sidebarRef = useRef(null);

  // Random phrases
  const phrases = [
    "I choose you!",
    "Gotta catch 'em all!",
    "Pikachu, Thunderbolt!",
    "It's super effective!",
    "Team Rocket's blasting off again!",
    "Believe in the heart of your Pokemon!",
    "Battle hard, train harder!",
    "Pokemon, let's go!",
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('favourites');
      if (stored && stored.length > 0 && Array.isArray(JSON.parse(stored))) {
        // no-op, validation only
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleChange = (event) => {
      setIsMobile(event.matches);
    };
    setIsMobile(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const openPanel = (panel) => {
    setActivePanel(panel);
    setShowSidebar(true);
    setShowMobileActions(false);
  };

  useEffect(() => {
    if (!team.length) {
      setIvPokemonId('');
      return;
    }
    if (!team.some(member => String(member.id) === String(ivPokemonId))) {
      setIvPokemonId(team[0].id);
    }
  }, [team, ivPokemonId]);

  const natureList = [
    { name: 'Hardy', up: null, down: null },
    { name: 'Lonely', up: 'attack', down: 'defense' },
    { name: 'Brave', up: 'attack', down: 'speed' },
    { name: 'Adamant', up: 'attack', down: 'specialAttack' },
    { name: 'Naughty', up: 'attack', down: 'specialDefense' },
    { name: 'Bold', up: 'defense', down: 'attack' },
    { name: 'Docile', up: null, down: null },
    { name: 'Relaxed', up: 'defense', down: 'speed' },
    { name: 'Impish', up: 'defense', down: 'specialAttack' },
    { name: 'Lax', up: 'defense', down: 'specialDefense' },
    { name: 'Modest', up: 'specialAttack', down: 'attack' },
    { name: 'Mild', up: 'specialAttack', down: 'defense' },
    { name: 'Quiet', up: 'specialAttack', down: 'speed' },
    { name: 'Bashful', up: null, down: null },
    { name: 'Rash', up: 'specialAttack', down: 'specialDefense' },
    { name: 'Calm', up: 'specialDefense', down: 'attack' },
    { name: 'Gentle', up: 'specialDefense', down: 'defense' },
    { name: 'Sassy', up: 'specialDefense', down: 'speed' },
    { name: 'Careful', up: 'specialDefense', down: 'specialAttack' },
    { name: 'Quirky', up: null, down: null },
    { name: 'Timid', up: 'speed', down: 'attack' },
    { name: 'Hasty', up: 'speed', down: 'defense' },
    { name: 'Jolly', up: 'speed', down: 'specialAttack' },
    { name: 'Naive', up: 'speed', down: 'specialDefense' },
    { name: 'Serious', up: null, down: null },
  ];

  const statMeta = [
    { key: 'hp', label: 'HP', isHp: true },
    { key: 'attack', label: 'Atk', isHp: false },
    { key: 'defense', label: 'Def', isHp: false },
    { key: 'specialAttack', label: 'SpA', isHp: false },
    { key: 'specialDefense', label: 'SpD', isHp: false },
    { key: 'speed', label: 'Spe', isHp: false },
  ];

  const getNatureMultiplier = (statKey) => {
    const nature = natureList.find(n => n.name === ivNature);
    if (!nature) return 1;
    if (nature.up === statKey) return 1.1;
    if (nature.down === statKey) return 0.9;
    return 1;
  };

  const calculateIvRange = (base, level, ev, observed, natureMultiplier, isHp) => {
    const obs = Number(observed);
    const lvl = Number(level);
    if (!base || !lvl || Number.isNaN(obs)) return null;
    const evTerm = Math.floor(Number(ev) / 4);
    let min = null;
    let max = null;
    for (let iv = 0; iv <= 31; iv += 1) {
      let statValue;
      if (isHp) {
        statValue = Math.floor(((2 * base + iv + evTerm) * lvl) / 100) + lvl + 10;
      } else {
        const baseCalc = Math.floor(((2 * base + iv + evTerm) * lvl) / 100) + 5;
        statValue = Math.floor(baseCalc * natureMultiplier);
      }
      if (statValue === obs) {
        if (min === null) min = iv;
        max = iv;
      }
    }
    if (min === null) return null;
    return { min, max };
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

        <div className="position-absolute top-0 end-0 pe-2 d-flex align-items-center h-100">
          {!isMobile && (
            <div className="header-action-group">
              <button
                className={`btn header-action-button action-button-white ${activePanel === 'filters' ? 'active' : ''}`}
                onClick={() => openPanel('filters')}
                aria-label="Open filters"
                aria-pressed={activePanel === 'filters'}
              >
                <i className="fas fa-filter" aria-hidden="true"></i>
              </button>
              <button
                className={`btn header-action-button action-button-white ${activePanel === 'team' ? 'active' : ''}`}
                onClick={() => openPanel('team')}
                aria-label="Open team"
                aria-pressed={activePanel === 'team'}
              >
                <i className="fas fa-users" aria-hidden="true"></i>
              </button>
              <button
                className={`btn header-action-button action-button-white ${activePanel === 'ivs' ? 'active' : ''}`}
                onClick={() => openPanel('ivs')}
                aria-label="Open IV calculator"
                aria-pressed={activePanel === 'ivs'}
              >
                <i className="fas fa-calculator" aria-hidden="true"></i>
              </button>
            </div>
          )}
        </div>
      </nav>

      {isMobile && (
        <div className={`fab-actions ${showMobileActions ? 'open' : ''}`}>
          <button
            className="btn btn-outline-light fab-main"
            onClick={() => setShowMobileActions(prev => !prev)}
            aria-label="Toggle actions"
            aria-expanded={showMobileActions}
          >
            <img
              src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/029b8bd9-cb5a-41e4-9c7e-ee516face9bb/dayo3ow-7ac86c31-8b2b-4810-89f2-e6134caf1f2d.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzAyOWI4YmQ5LWNiNWEtNDFlNC05YzdlLWVlNTE2ZmFjZTliYlwvZGF5bzNvdy03YWM4NmMzMS04YjJiLTQ4MTAtODlmMi1lNjEzNGNhZjFmMmQuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ooubhxjHp9PIMhVxvCFHziI6pxDAS8glXPWenUeomWs"
              alt="Open actions"
              className="fab-main-image"
            />
          </button>
          <button
            className={`btn fab-item action-button-white ${activePanel === 'filters' ? 'active' : ''}`}
            onClick={() => openPanel('filters')}
            aria-label="Open filters"
            aria-pressed={activePanel === 'filters'}
          >
            <i className="fas fa-filter" aria-hidden="true"></i>
          </button>
          <button
            className={`btn fab-item action-button-white ${activePanel === 'team' ? 'active' : ''}`}
            onClick={() => openPanel('team')}
            aria-label="Open team"
            aria-pressed={activePanel === 'team'}
          >
            <i className="fas fa-users" aria-hidden="true"></i>
          </button>
          <button
            className={`btn fab-item action-button-white ${activePanel === 'ivs' ? 'active' : ''}`}
            onClick={() => openPanel('ivs')}
            aria-label="Open IV calculator"
            aria-pressed={activePanel === 'ivs'}
          >
            <i className="fas fa-calculator" aria-hidden="true"></i>
          </button>
        </div>
      )}

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
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setShowPageModal(true)}
          >
            Help ❓
          </button>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setShowSidebar(false)}
          >
            Close ✖
          </button>
        </div>

        {activePanel === 'filters' && (
          <>
            <button
              id="favourites-button"
              className={`btn btn-sm btn-warning text-black mb-3 w-100 fw-bold ${
                showFavouritesOnly ? 'active' : ''
              }`}
              style={{ fontSize: '0.9rem' }}
              onClick={() => {
                if (typeof onToggleFavouritesFilter === 'function') {
                  const stored = JSON.parse(localStorage.getItem('favourites') || '[]');
                  if (stored.length === 0) {
                    const originalText = showFavouritesOnly ? 'Showing Favourites' : 'View Favourites';
                    const button = document.getElementById('favourites-button');
                    if (button) {
                      button.disabled = true;
                      const originalContent = button.innerHTML;
                      button.innerHTML = 'No favourites yet!';
                      setTimeout(() => {
                        button.innerHTML = originalContent;
                        button.disabled = false;
                      }, 2000);
                    }
                    return;
                  }
                  onToggleFavouritesFilter(!showFavouritesOnly);
                }
              }}
            >
              {showFavouritesOnly ? 'View All' : 'View Favourites'}
            </button>

            <button
              className="btn btn-sm btn-danger mb-3 w-100"
              onClick={() => {
                setSelectedTypes([]);
                setSelectedRegionsInternal([]);
                setSelectedRegions([]);
                setSearchQuery('');
                onTypeFilterChange([]);
                setShowFavouritesOnly(false);
                if (typeof onToggleFavouritesFilter === 'function') {
                  onToggleFavouritesFilter(false);
                }
              }}
            >
              Reset Filters
            </button>

            <div className="mb-3">
              <form
                className="d-flex"
                onSubmit={e => e.preventDefault()}
                role="search"
                aria-label="Search Pokemon"
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  aria-label="Search Pokemon by name or number"
                />
              </form>
            </div>

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
                    className={`form-check d-flex flex-column justify-content-center align-items-center type-filter ${
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
                      textAlign: 'center',
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
                      onChange={() => {}}
                      style={{ display: 'none' }}
                      tabIndex={-1}
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="d-flex flex-column align-items-center"
                      style={{ pointerEvents: 'none' }}
                    >
                      <img
                        src={typeIcons[type]}
                        alt={`${type} icon`}
                        style={{
                          width: '30px',
                          height: '30px',
                          filter: 'brightness(0) invert(1)',
                          pointerEvents: 'none',
                          marginBottom: '4px',
                        }}
                        draggable={false}
                      />
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'white',
                          textTransform: 'capitalize',
                          pointerEvents: 'none',
                        }}
                      >
                        {type}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

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
                    <label htmlFor={`region-${region}`} className="w-100" style={{ pointerEvents: 'none' }}>
                      {region}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activePanel === 'team' && (
          <div className="mt-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Team</h5>
              <span className="badge bg-secondary">{team.length}/6</span>
            </div>
            {team.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: '#bbb' }}>No Pokemon in the team.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {team.map(member => (
                  <div
                    key={member.id}
                    className="d-flex align-items-center justify-content-between bg-dark text-white rounded"
                    style={{ padding: '6px 8px', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                      {member.sprite && (
                        <img
                          src={member.sprite}
                          alt={member.name}
                          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                        />
                      )}
                      <div>
                        <div className="text-capitalize" style={{ fontSize: '0.9rem' }}>{member.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#bbb' }}>No. {member.id}</div>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() => onRemoveFromTeam && onRemoveFromTeam(member.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            {team.length > 0 && (
              <button
                className="btn btn-sm btn-outline-warning w-100 mt-2"
                onClick={() => onClearTeam && onClearTeam()}
              >
                Clear team
              </button>
            )}
          </div>
        )}

        {activePanel === 'ivs' && (
          <div className="mt-2">
            <h5 className="mb-3">IV Calculator</h5>
            {team.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: '#bbb' }}>Add a Pokemon to the team to calculate IVs.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Pokemon</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {(() => {
                      const selected = team.find(member => String(member.id) === String(ivPokemonId));
                      if (!selected?.sprite) return null;
                      return (
                        <img
                          src={selected.sprite}
                          alt={selected.name}
                          style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                        />
                      );
                    })()}
                    <select
                      className="form-select form-select-sm"
                      value={ivPokemonId}
                      onChange={e => setIvPokemonId(e.target.value)}
                    >
                      {team.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="d-flex" style={{ gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Level</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      min="1"
                      max="100"
                      value={ivLevel}
                      onChange={e => setIvLevel(e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Nature</label>
                    <select
                      className="form-select form-select-sm"
                      value={ivNature}
                      onChange={e => setIvNature(e.target.value)}
                    >
                      {natureList.map(nature => (
                        <option key={nature.name} value={nature.name}>{nature.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', color: '#bbb', marginBottom: '4px' }}>EVs (0-252)</div>
                  <div className="d-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {statMeta.map(stat => (
                      <input
                        key={`ev-${stat.key}`}
                        type="number"
                        className="form-control form-control-sm"
                        min="0"
                        max="252"
                        value={ivEvs[stat.key]}
                        onChange={e => setIvEvs(prev => ({ ...prev, [stat.key]: e.target.value }))}
                        placeholder={stat.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', color: '#bbb', marginBottom: '4px' }}>Observed stats</div>
                  <div className="d-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {statMeta.map(stat => (
                      <input
                        key={`stat-${stat.key}`}
                        type="number"
                        className="form-control form-control-sm"
                        min="1"
                        value={ivStats[stat.key]}
                        onChange={e => setIvStats(prev => ({ ...prev, [stat.key]: e.target.value }))}
                        placeholder={stat.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-2">
                  <div style={{ fontSize: '0.85rem', color: '#bbb', marginBottom: '6px' }}>IV Results</div>
                  {(() => {
                    const selected = team.find(member => String(member.id) === String(ivPokemonId));
                    if (!selected) return null;
                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        {statMeta.map(stat => {
                          const range = calculateIvRange(
                            selected.baseStats[stat.key],
                            ivLevel,
                            ivEvs[stat.key],
                            ivStats[stat.key],
                            getNatureMultiplier(stat.key),
                            stat.isHp
                          );
                          let text = '-';
                          if (ivStats[stat.key] !== '') {
                            text = range ? `${range.min}-${range.max}` : 'No match';
                          }
                          return (
                            <div
                              key={`range-${stat.key}`}
                              className="bg-dark text-white rounded"
                              style={{ padding: '6px', fontSize: '0.8rem', textAlign: 'center' }}
                            >
                              {stat.label}: {text}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
        {/* GitHub footer icon */}
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            display: 'none',
          }}
          className="text-center mt-4 pt-4 border-top d-none d-md-block"
        >
          <a
            href="https://github.com/MrJhonny/pokedex"
            target="_blank"
            rel="noopener noreferrer"
            className="d-inline-block"
            style={{ textDecoration: 'none' }}
          >
            <img
              src="https://user-images.githubusercontent.com/74038190/212257468-1e9a91f1-b626-4baa-b15d-5c385dfa7ed2.gif"
              alt="GitHub"
              style={{
                width: '30px',
                height: '30px',
                filter: 'invert(1)',
                transition: 'transform 0.2s ease-in-out',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
            />
          </a>
        </div>
      </div>
      {showPageModal && <Page onClose={() => setShowPageModal(false)} />}
    </>
  );
};

export default Header;