import { useState } from 'react';

const Header = ({ searchQuery, setSearchQuery }) => {
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="bg-light border-bottom sticky-top">
      <div className="container d-flex justify-content-between align-items-center py-2">
        <h1 className="h4 m-0">Pokédex Didáctica</h1>
        <input
          type="text"
          placeholder="Buscar por nombre o número"
          value={searchQuery}
          onChange={handleChange}
          className="form-control w-50"
        />
      </div>
    </header>
  );
};

export default Header;