import React from 'react';
import PropTypes from 'prop-types';

function Badge({ children, className, color, outlined }) {
  const colorClass = color ? `badge-${color}` : '';
  const classes = className || '';
  const outlinedClass = outlined ? 'badge-outline' : '';
  return <div className={`badge ${colorClass} ${outlinedClass} ${classes}`}>{children}</div>;
}

Badge.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'accent',
    'ghost',
    'info',
    'warning',
    'success',
    'error',
  ]),
  outlined: PropTypes.bool,
};

export default Badge;
