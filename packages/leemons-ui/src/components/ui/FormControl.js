import * as _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Label from './Label';
import Checkbox from './Checkbox';
import Radio from './Radio';
import Toggle from './Toggle';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';
import { ExclamationIcon } from '@heroicons/react/solid';

function FormControl({ children, label, labelPosition, className, formError }) {
  const childrens = React.Children.toArray(children);

  let isCheckbox = false;

  _.forEach(childrens, (child) => {
    isCheckbox = child.type === Checkbox || child.type === Radio || child.type === Toggle;
    if (isCheckbox) return false;
  });

  const Component = isCheckbox ? Label : React.Fragment;
  const componentProps = isCheckbox
    ? { text: label, className: 'cursor-pointer', labelPosition }
    : {};

  const formItemIndex = childrens.findIndex(
    (child) =>
      child.type === Checkbox ||
      child.type === Radio ||
      child.type === Toggle ||
      child.type === Input ||
      child.type === Select ||
      child.type === Textarea
  );

  if (formItemIndex >= 0) {
    const childrenProps = {};
    if (formError) childrenProps.color = 'error';
    childrens[formItemIndex] = React.cloneElement(childrens[formItemIndex], childrenProps);
  }

  return (
    <div className={`form-control ${className || ''}`}>
      <Component {...componentProps}>
        {typeof label !== 'undefined' && !isCheckbox && <Label text={label} />}
        {childrens}
        {formError ? (
          <Label
            text={
              <>
                <ExclamationIcon className="inline-block mr-1 h-4 text-error fill-current" />
                {formError.message}
              </>
            }
            helper
          />
        ) : null}
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
  formError: PropTypes.any,
};

export default FormControl;
