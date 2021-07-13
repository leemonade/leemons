import React from 'react';
import PropTypes from 'prop-types';

function Badge({ children, className }) {
  return <div className={`badge ${className || ''}`}>{children}</div>;
}

Badge.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default Badge;
