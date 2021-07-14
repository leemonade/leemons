import React from 'react';
import PropTypes from 'prop-types';

function Select({ children, className }) {
  return <select className={`select ${className || ''}`}>{children}</select>;
}

Select.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default Select;
