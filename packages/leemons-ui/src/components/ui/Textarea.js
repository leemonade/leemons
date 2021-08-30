import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Textarea = React.forwardRef(
  ({ className, color, outlined, showCount, onChange, maxLength, ...props }, ref) => {
    const colorClass = color ? `textarea-${color}` : '';
    const outlinedClass = outlined ? 'textarea-bordered' : '';
    const [count, setCount] = useState(0);

    const handleChange = (e) => {
      if (onChange) onChange(e);
      setCount(e.target.value.length);
    };

    return (
      <div className="relative">
        <textarea
          ref={ref}
          className={`textarea w-full ${colorClass} ${outlinedClass} ${className || ''}`}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        ></textarea>
        {showCount && (
          <div className="absolute bottom-0 right-0 transform translate-y-5 label-text-alt font-inter text-neutral-content">{`${count}${
            maxLength > 0 && '/' + maxLength
          }`}</div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
  className: PropTypes.string,
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

export default Textarea;
