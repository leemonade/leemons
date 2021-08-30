import React from 'react';
import PropTypes from 'prop-types';

function Navbar({ children, className }) {
  return <div className={`navbar ${className || ''}`}>{children}</div>;
}

Navbar.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default Navbar;
