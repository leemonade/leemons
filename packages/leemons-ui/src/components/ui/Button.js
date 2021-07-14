import React from 'react';
import PropTypes from 'prop-types';

function Button({ children, className, color, ...props }) {
  const colorClass = color ? `badge-${color}` : '';
  const classes = className || '';
  return (
    <button className={`btn ${classes} ${colorClass}`} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'accent',
    'info',
    'warning',
    'success',
    'error',
    'ghost',
  ]),
};

export default Button;
