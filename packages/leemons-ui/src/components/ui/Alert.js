import React from 'react';
import PropTypes from 'prop-types';

function Alert({ children, className }) {
  return <div className={`alert ${className || ''}`}>{children}</div>;
}

Alert.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default Alert;
