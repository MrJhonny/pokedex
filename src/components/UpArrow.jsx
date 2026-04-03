import React, { useState, useEffect, useLayoutEffect } from 'react';

const UpArrow = () => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect width on mount (sync)
  useLayoutEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
  }, []);

  // Update isMobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Do not show on mobile
  if (isMobile) return null;

  if (!visible || document.body.classList.contains('hide-uparrow')) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 10,
      }}
    >
      <button
        onClick={handleScrollToTop}
        className="btn btn-warning d-flex flex-column align-items-center gap-2"
      >
        <img
          src="/pikachu-jumping.gif"
          alt="Back to top"
          width="80"
          height="80"
        />
        <span className="fw-bold">Back to top</span>
      </button>
    </div>
  );
};

export default UpArrow;