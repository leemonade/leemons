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
  link,
  ...props
}) {
  const classes = className || '';
  const roundClass = rounded ? 'rounded-full' : '';
  const colorClass = color ? `btn-${color}` : '';
  const outlinedClass = outlined ? 'btn-outline' : '';
  const wideClass = wide ? 'btn-wide' : '';
  const loadingClass = loading ? 'loading' : '';
  const squareClass = square ? 'btn-square' : '';
  const circleClass = circle ? 'btn-circle' : '';
  const linkClass = link ? 'btn-link' : '';
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
        linkClass,
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
  wide: PropTypes.bool,
  loading: PropTypes.bool,
  square: PropTypes.bool,
  circle: PropTypes.bool,
  link: PropTypes.bool,
  className: PropTypes.string,
  rounded: PropTypes.bool,
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

export default Button;
