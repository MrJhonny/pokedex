// src/components/SearchBar.jsx
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-control"
        placeholder="Buscar por nombre o número"
        value={query}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;