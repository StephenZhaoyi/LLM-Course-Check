import React from 'react';
import TUMLogoSVG from '../../assets/tum-logo.svg';

const TUMLogo = ({ className = 'h-4 w-auto' }) => {
  return (
    <img
      src={TUMLogoSVG}
      alt="TUM Logo"
      className={className}
    />
  );
};

export default TUMLogo;