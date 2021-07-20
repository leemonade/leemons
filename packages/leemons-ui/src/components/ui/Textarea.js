import React from 'react';
import PropTypes from 'prop-types';

const Textarea = React.forwardRef(({ className, color, outlined, ...props }, ref) => {
  const colorClass = color ? `textarea-${color}` : '';
  const outlinedClass = outlined ? 'textarea-bordered' : '';
  return (
    <textarea
      ref={ref}
      className={`textarea ${colorClass} ${outlinedClass} ${className || ''}`}
      {...props}
    ></textarea>
  );
});

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
