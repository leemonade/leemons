import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = React.forwardRef(({ className, color, ...props }, ref) => {
  const colorClass = color ? `checkbox-${color}` : '';

  return (
    <div>
      <input
        ref={ref}
        type="checkbox"
        className={`checkbox ${colorClass} ${className || ''}`}
        {...props}
      />
      <span className="checkbox-mark"></span>
    </div>
  );
});

Checkbox.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['neutral', 'primary', 'secondary', 'accent']),
};

export default Checkbox;
