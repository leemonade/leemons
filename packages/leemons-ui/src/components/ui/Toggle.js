import React from 'react';
import PropTypes from 'prop-types';

function Toggle({ className, readOnly, onChange = () => {}, color, ...props }) {
  const colorClass = color ? `toggle-${color}` : '';
  return (
    <div>
      <input
        type="checkbox"
        className={`toggle ${colorClass} ${className || ''}`}
        onChange={(e) => (readOnly ? null : onChange(e))}
        {...props}
      />
      <span className="toggle-mark"></span>
    </div>
  );
}

Toggle.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['neutral', 'primary', 'secondary', 'accent', 'error']),
};

export default Toggle;
