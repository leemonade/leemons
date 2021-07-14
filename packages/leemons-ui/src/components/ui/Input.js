import React from 'react';
import PropTypes from 'prop-types';

function Input({ type, ...props }) {
  return <input type={type} {...props} />;
}

Input.propTypes = {
  type: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
};

export default Input;
