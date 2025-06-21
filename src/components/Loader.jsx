import React from 'react';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100dvh',
        backgroundImage: "url('/background.gif')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: '#f2f2f2',
        overflow: 'hidden',
        position: 'fixed',
        inset: 0
      }}
    >
      <img
        src="/Running-Pikachu-GIF.webp"
        alt="Loading..."
        style={{
          width: 'min(60vw, 300px)',
          height: 'auto',
          maxWidth: '1000%'
        }}
      />
    </div>
  );
};

export default Loader;