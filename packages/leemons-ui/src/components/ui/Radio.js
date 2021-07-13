import React from 'react';
import PropTypes from 'prop-types';

function Radio({ className, name, value, ...props }) {
  return (
    <div>
      <input
        type="radio"
        className={`radio ${className || ''}`}
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
};

export default Radio;
