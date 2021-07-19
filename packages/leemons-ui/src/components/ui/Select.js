import React from 'react';
import PropTypes from 'prop-types';

function Select({ children, className, outlined, color, ...props }) {
  const colorClass = color ? `select-${color}` : '';
  const outlinedClass = outlined ? 'select-bordered' : '';
  const classes = className?.split(' ') || [];
  const selectClasses = classes.filter((item) => item.trim().indexOf('select-') === 0);
  const wrapperClasses = classes.filter((item) => item.trim().indexOf('select-') < 0);
  return (
    <div className={`select-wrapper ${wrapperClasses.join(' ')}`}>
      <select
        className={['select', colorClass, outlinedClass, selectClasses.join(' ')].join(' ')}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

Select.propTypes = {
  children: PropTypes.any,
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

export default Select;
