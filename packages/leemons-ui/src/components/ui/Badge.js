import React from 'react';
import PropTypes from 'prop-types';

function Badge({ children, className, color }) {
  const colorClass = color ? `badge-${color}` : '';
  const classes = className || '';
  return <div className={`badge ${classes} ${colorClass}`}>{children}</div>;
}

Badge.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'accent', 'info', 'warning', 'success', 'error']),
};

export default Badge;
