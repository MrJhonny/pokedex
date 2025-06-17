import React, { useState, useEffect } from 'react';

const UpArrow = () => {
  const [visible, setVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleScrollToTop}
        className="btn btn-warning d-flex flex-column align-items-center gap-2"
      >
        <img
          src="/pikachu-jumping.gif"
          alt="Ir arriba"
          width="80"
          height="80"
        />
        <span className="fw-bold">Ir Arriba</span>
      </button>
    </div>
  );
};

export default UpArrow;