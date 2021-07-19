import React from 'react';
import PropTypes from 'prop-types';

function Alert({ children, className, color }) {
  const colorClass = color ? `alert-${color}` : '';
  const classes = className || '';
  return <div className={`alert ${colorClass} ${classes}`}>{children}</div>;
}

Alert.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  color: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
};

export default Alert;
