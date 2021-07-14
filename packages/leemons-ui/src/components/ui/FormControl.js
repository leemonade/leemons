import React from 'react';
import PropTypes from 'prop-types';

function FormControl({ children, className }) {
  return <div className={`form-control ${className || ''}`}>{children}</div>;
}

FormControl.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default FormControl;
