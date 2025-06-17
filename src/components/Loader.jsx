import React from 'react';

const Loader = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <img src="/loader.gif" alt="Loading..." />
    </div>
  );
};

export default Loader;