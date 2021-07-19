import React from 'react';
import PropTypes from 'prop-types';

function MenuItem({ children, className, color, outlined }) {
  const colorClass = color ? `menu-item-${color}` : '';
  const outlinedClass = outlined ? 'menu-item-bordered' : '';
  return (
    <li className={['menu-item', colorClass, outlinedClass, className || ''].join(' ')}>
      {children}
    </li>
  );
}

MenuItem.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  outlined: PropTypes.bool,
  color: PropTypes.oneOf(['neutral', 'primary', 'secondary', 'accent', 'white']),
};

export default MenuItem;
