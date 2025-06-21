import React from 'react';

const runningPikachu = '/Running-Pikachu-GIF.webp';

const LoaderMini = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0',
        width: '100%'
      }}
    >
      <img
        src={runningPikachu}
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

export default LoaderMini;