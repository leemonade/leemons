import React from 'react';
import PropTypes from 'prop-types';

function Progress({ className }) {
  return <progress className={`progress ${className || ''}`}></progress>;
}

Progress.propTypes = {
  className: PropTypes.string,
};

export default Progress;
