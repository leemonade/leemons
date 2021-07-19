import React from 'react';
import PropTypes from 'prop-types';

function Input({ type, className, outlined, color, ...props }) {
  const colorClass = color ? `input-${color}` : '';
  const outlinedClass = outlined ? 'input-bordered' : '';
  return (
    <input
      type={type}
      className={['input', colorClass, outlinedClass, className].join(' ')}
      {...props}
    />
  );
}

Input.defaultProps = {
  type: 'text',
};

Input.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  outlined: PropTypes.bool,
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'accent',
    'info',
    'warning',
    'success',
    'error',
    'ghost',
  ]),
};

export default Input;
