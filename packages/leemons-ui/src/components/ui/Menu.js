import React from 'react';
import PropTypes from 'prop-types';

function Menu({ children }) {
  return <ul className="menu">{children}</ul>;
}

Menu.propTypes = {
  children: PropTypes.any,
};

export default Menu;
