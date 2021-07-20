import React from 'react';
import PropTypes from 'prop-types';

function Tooltip({ children, className, color, content, position }) {
  const positionClass = position ? `tooltip-${position}` : '';
  const colorClass = color ? `tooltip-${color}` : '';
  const classes = className || '';
  return (
    <div data-tip={content} className={`tooltip ${colorClass} ${positionClass} ${classes}`}>
      {children}
    </div>
  );
}

Tooltip.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  content: PropTypes.any,
  position: PropTypes.oneOf(['left', 'right', 'bottom']),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'accent',
    'ghost',
    'info',
    'warning',
    'success',
    'error',
  ]),
  outlined: PropTypes.bool,
};

export default Tooltip;
