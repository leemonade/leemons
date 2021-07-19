import React from 'react';
import PropTypes from 'prop-types';
import Label from './Label';
import Checkbox from './Checkbox';
import Radio from './Radio';
import Toggle from './Toggle';

function FormControl({ children, label, labelPosition, className }) {
  const isCheckbox =
    children.type === Checkbox || children.type === Radio || children.type === Toggle;

  const Component = isCheckbox ? Label : React.Fragment;
  const componentProps = isCheckbox
    ? { text: label, className: 'cursor-pointer', labelPosition }
    : {};

  return (
    <div className={`form-control ${className || ''}`}>
      <Component {...componentProps}>
        {typeof label !== 'undefined' && !isCheckbox && <Label text={label} />}
        {children}
      </Component>
    </div>
  );
}

FormControl.defaultProps = {
  labelPosition: 'left',
};

FormControl.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  label: PropTypes.any,
  labelPosition: PropTypes.oneOf(['left', 'right']),
};

export default FormControl;
