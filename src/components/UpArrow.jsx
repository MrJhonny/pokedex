import React from 'react';

const UpArrow = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="text-center my-4">
      <button
        onClick={handleScrollToTop}
        className="btn btn-warning d-flex flex-column align-items-center gap-2 mx-auto"
      >
        <img
          src="/pikachu-jumping.gif"
          alt="Ir arriba"
          width="100"
          height="100"
        />
        <span className="fw-bold">Ir Arriba</span>
      </button>
    </div>
  );
};

export default UpArrow;