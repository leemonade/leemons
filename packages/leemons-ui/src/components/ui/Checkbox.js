import React from 'react';
import PropTypes from 'prop-types';

function Checkbox({ className, ...props }) {
  return (
    <div>
      <input type="checkbox" className={`checkbox ${className || ''}`} {...props} />
      <span className="checkbox-mark"></span>
    </div>
  );
}

Checkbox.propTypes = {
  className: PropTypes.string,
};

export default Checkbox;
