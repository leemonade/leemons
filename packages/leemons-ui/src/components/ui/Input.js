import React from 'react';
import PropTypes from 'prop-types';

const Input = React.forwardRef(
  (
    { type, className, outlined, color, onKeyEnter = () => {}, onKeyDown = () => {}, ...props },
    ref
  ) => {
    const colorClass = color ? `input-${color}` : '';
    const outlinedClass = outlined ? 'input-bordered' : '';
    const myOnKeyDown = (e) => {
      onKeyDown(e);
      if (e.key === 'Enter') onKeyEnter(e);
    };
    return (
      <input
        ref={ref}
        type={type}
        className={['input', colorClass, outlinedClass, className].join(' ')}
        onKeyDown={myOnKeyDown}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

Input.defaultProps = {
  type: 'text',
};

Input.propTypes = {
  type: PropTypes.string,
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

export default Input;
