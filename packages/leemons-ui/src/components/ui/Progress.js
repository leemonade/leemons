import React from 'react';
import PropTypes from 'prop-types';

function Progress({ className, ...props }) {
  return <progress className={`progress ${className || ''}`} {...props}></progress>;
}

Progress.propTypes = {
  className: PropTypes.string,
};

export default Progress;
