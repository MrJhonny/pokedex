import React from 'react';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        backgroundImage: "url('/background.gif')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
      <img
        src="/Running-Pikachu-GIF.webp"
        alt="Loading..."
        style={{ width: '150px', height: 'auto' }}
      />
    </div>
  );
};

export default Loader;