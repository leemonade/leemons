import React from 'react';
import PropTypes from 'prop-types';

function Button({ children, className, ...props }) {
  return (
    <button className={`btn ${className || ''}`} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default Button;
