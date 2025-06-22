import React, { useEffect } from 'react';

const Page = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleOutsideClick = (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '640px',
        maxHeight: '85vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'transparent',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#000',
        }}>×</button>
        <div className="help-page" style={{
          fontFamily: 'Arial, sans-serif',
          color: '#222',
          lineHeight: '1.75',
          fontSize: '16px',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '1rem', textAlign: 'center' }}>How does this Pokédex work?</h2>
          <p>This is a didactic Pokédex made for learning purposes. Here’s a quick guide:</p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', textAlign: 'left' }}>
              <li><strong>Search Bar:</strong> Type a Pokémon’s name to find it quickly.</li>
              <li><strong>Type Filter:</strong> Use this to filter Pokémon by their type (e.g., Fire, Water, Grass).</li>
              <li><strong>Region Filter:</strong> Use this to view Pokémon based on their regional appearance.</li>
              <li><strong>Favourite Button:</strong> Click the heart icon ❤️ to add or remove Pokémon from your favourites.</li>
              <li><strong>View Favourites:</strong> Toggles the view to show only your favourite Pokémon.</li>
              <li><strong>Reset Filters:</strong> Clears all active filters and resets the view.</li>
            </ul>
          </div>

          <h3 style={{ fontSize: '20px', marginTop: '2rem', marginBottom: '0.75rem' }}>Visual Indicators:</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', textAlign: 'left' }}>
              <li><strong>Shiny Toggle:</strong> Lets you switch between normal and shiny Pokémon sprites.</li>
              <li><strong>Stats Chart:</strong> Displays the Pokémon’s stats in a bar graph format.</li>
              <li><strong>Evolutions:</strong> Shows the evolutionary line of the Pokémon if it has one.</li>
            </ul>
          </div>

          <p>Enjoy exploring the world of Pokémon!</p>

          <h3 style={{ fontSize: '20px', marginTop: '2rem', marginBottom: '0.75rem' }}>Coming Soon:</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', textAlign: 'left' }}>
              <li><strong>Create a Pokémon Team:</strong> Build your own Pokémon lineup and save it.</li>
              <li><strong>IV Calculator:</strong> Calculate the potential IVs of your Pokémon based on stats.</li>
            </ul>
          </div>
          <p style={{ marginTop: '2rem', fontStyle: 'italic', fontSize: '15px' }}>
            Note: Some features may not be fully available on mobile devices. This Pokédex was initially designed for PC screens, but mobile compatibility improvements are on the way.
          </p>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <img 
            src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/029b8bd9-cb5a-41e4-9c7e-ee516face9bb/dayo3ow-7ac86c31-8b2b-4810-89f2-e6134caf1f2d.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzAyOWI4YmQ5LWNiNWEtNDFlNC05YzdlLWVlNTE2ZmFjZTliYlwvZGF5bzNvdy03YWM4NmMzMS04YjJiLTQ4MTAtODlmMi1lNjEzNGNhZjFmMmQuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ooubhxjHp9PIMhVxvCFHziI6pxDAS8glXPWenUeomWs" 
            alt="Decorative gif" 
            style={{ width: '100px', height: '100px', borderRadius: '8px' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
