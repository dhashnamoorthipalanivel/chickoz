import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TopbarLoader = () => {
  const location = useLocation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = setTimeout(() => {
      setActive(false);
    }, 600); // 600ms duration for the loader to "complete"

    return () => clearTimeout(timer);
  }, [location]);

  if (!active) return null;

  return (
    <div className="pace pace-active">
      <div className="pace-progress" style={{ 
        transform: 'translate3d(100%, 0px, 0px)',
        transition: 'transform 600ms ease-out',
        width: '100%',
        position: 'fixed',
        zIndex: 9999,
        top: 0,
        left: '-100%',
        height: '3px',
        background: 'linear-gradient(to right, #5156be 20%, #2ab57d 40%, #4ba6ef 60%, #ffbf53 80%, #fd625e 100%)'
      }}>
        <div className="pace-progress-inner"></div>
      </div>
      <div className="pace-activity"></div>
    </div>
  );
};

export default TopbarLoader;
