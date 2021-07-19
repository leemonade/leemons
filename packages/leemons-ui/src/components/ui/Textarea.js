import React from 'react';
import PropTypes from 'prop-types';

function Textarea({ className, color, outlined, ...props }) {
  const colorClass = color ? `textarea-${color}` : '';
  const outlinedClass = outlined ? 'textarea-bordered' : '';
  return (
    <textarea
      className={`textarea ${colorClass} ${outlinedClass} ${className || ''}`}
      {...props}
    ></textarea>
  );
}

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
