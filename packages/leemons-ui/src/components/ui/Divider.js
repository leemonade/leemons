import React from 'react';
import PropTypes from 'prop-types';

function Divider({ children, className, vertical }) {
  const verticalClass = vertical ? `divider-vertical` : '';
  const classes = className || '';
  return <div className={`divider ${verticalClass} ${classes}`}>{children}</div>;
}

Divider.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  vertical: PropTypes.bool,
};

export default Divider;
