import React from 'react';
import PropTypes from 'prop-types';

function Menu({ children, className, compact, horizontal }) {
  const compactClass = compact ? 'menu-compact' : '';
  const horizontalClass = horizontal ? 'menu-horizontal' : '';
  return (
    <ul className={`menu ${compactClass} ${horizontalClass} ${className || ''}`}>{children}</ul>
  );
}

Menu.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  compact: PropTypes.bool,
  horizontal: PropTypes.bool,
};

export default Menu;
