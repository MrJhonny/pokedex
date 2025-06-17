// src/components/SearchBar.jsx
import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-control"
        placeholder="Buscar por nombre o número"
        value={searchQuery}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;