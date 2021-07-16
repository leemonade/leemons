import React from 'react';
import PropTypes from 'prop-types';

function Button({
  children,
  className,
  color,
  rounded,
  outlined,
  wide,
  loading,
  square,
  circle,
  ...props
}) {
  const colorClass = color ? `btn-${color}` : '';
  const classes = className || '';
  const roundClass = rounded ? 'rounded-full' : '';
  const outlinedClass = outlined ? 'btn-outline' : '';
  const wideClass = wide ? 'btn-wide' : '';
  const loadingClass = loading ? 'loading' : '';
  const squareClass = square ? 'btn-square' : '';
  const circleClass = circle ? 'btn-circle' : '';
  return (
    <button
      className={[
        'btn',
        outlinedClass,
        colorClass,
        wideClass,
        roundClass,
        loadingClass,
        squareClass,
        circleClass,
        classes,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  outlined: PropTypes.bool,
  wide: PropTypes.bool,
  loading: PropTypes.bool,
  square: PropTypes.bool,
  circle: PropTypes.bool,
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

export default Button;
