import React from 'react';
import PropTypes from 'prop-types';

function Card({ children, className }) {
  return <div className={`card ${className || ''}`}>{children}</div>;
}

Card.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default Card;
