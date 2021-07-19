import React from 'react';
import PropTypes from 'prop-types';

function Radio({ className, name, value, color, ...props }) {
  const colorClass = color ? `radio-${color}` : '';
  return (
    <div>
      <input
        type="radio"
        className={`radio ${className || ''} ${colorClass}`}
        name={name}
        value={value}
        {...props}
      />
      <span className="radio-mark"></span>
    </div>
  );
}

Radio.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
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

export default Radio;
