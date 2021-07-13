import React from 'react';
import PropTypes from 'prop-types';

function Hero({ children, className }) {
  return <div className={`hero ${className || ''}`}>{children}</div>;
}

Hero.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default Hero;
