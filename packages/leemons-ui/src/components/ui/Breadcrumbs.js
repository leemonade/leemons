import React from 'react';
import PropTypes from 'prop-types';

function Breadcrumbs({ children, className, color }) {
  const colorClass = color ? `text-${color}` : '';
  const classes = className || '';
  return (
    <div className={`text-sm breadcrumbs ${colorClass} ${classes}`}>
      <ul>{children}</ul>
    </div>
  );
}

Breadcrumbs.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
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

export default Breadcrumbs;
