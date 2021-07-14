import React from 'react';
import PropTypes from 'prop-types';

function Menu({ children, className }) {
  return <ul className={`menu ${className || ''}`}>{children}</ul>;
}

Menu.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default Menu;
