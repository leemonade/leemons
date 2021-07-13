import React from 'react';
import PropTypes from 'prop-types';

function MenuItem({ children }) {
  return <li>{children}</li>;
}

MenuItem.propTypes = {
  children: PropTypes.any,
};

export default MenuItem;
