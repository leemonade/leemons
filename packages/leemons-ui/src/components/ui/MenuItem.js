import React from 'react';
import PropTypes from 'prop-types';

function MenuItem({ children, className }) {
  return <li className={className}>{children}</li>;
}

MenuItem.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default MenuItem;
