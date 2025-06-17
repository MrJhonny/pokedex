import { useState } from 'react';

const Header = ({ searchQuery, setSearchQuery }) => {
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="bg-light border-bottom sticky-top">
      <div className="container d-flex justify-content-between align-items-center flex-wrap py-2">
        <h1 className="h4 m-0">Pokédex Didáctica</h1>
        <div className="mb-4 mb-md-0" style={{ minWidth: '250px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o número"
            value={searchQuery}
            onChange={handleChange}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;