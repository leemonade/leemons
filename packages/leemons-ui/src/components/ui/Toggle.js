import React from 'react';
import PropTypes from 'prop-types';

function Toggle({ className, ...props }) {
  return (
    <div>
      <input type="checkbox" className={`toggle ${className || ''}`} {...props} />
      <span className="toggle-mark"></span>
    </div>
  );
}

Toggle.propTypes = {
  className: PropTypes.string,
};

export default Toggle;
