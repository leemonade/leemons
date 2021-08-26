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

function oneChildrenIsCheckbox(childrens) {
  let isCheckbox = false;
  _.forEach(childrens, (child) => {
    isCheckbox = child.type === Checkbox || child.type === Radio || child.type === Toggle;
    if (isCheckbox) return false;
    if (child?.props?.children)
      isCheckbox = oneChildrenIsCheckbox(React.Children.toArray(child?.props?.children));
    if (isCheckbox) return false;
  });
  return isCheckbox;
}

function equalsOneOfTypes(item, types) {
  let isEquals = false;
  _.forEach(types, (type) => {
    if (type === item.type) {
      isEquals = true;
      return false;
    }
  });
  return isEquals;
}

function getItemOfOneType(childrens, types) {
  let item = null;
  _.forEach(childrens, (child) => {
    if (equalsOneOfTypes(child, types)) {
      item = child;
      return false;
    } else if (child?.props?.children) {
      item = getItemOfOneType(React.Children.toArray(child?.props?.children), types);
      if (item) return false;
    }
  });
  return item;
}

function replaceItem(childrens, item, to) {
  _.forEach(childrens, (child, index) => {
    if (child === item) {
      childrens[index] = to;
      return false;
    } else if (child?.props?.children) {
      replaceItem(React.Children.toArray(child?.props?.children), item, to);
    }
  });
}

function FormControl({ children, label, labelPosition, className, formError, multiple }) {
  const childrens = React.Children.toArray(children);

  let isCheckbox = oneChildrenIsCheckbox(childrens);

  const Component = isCheckbox && !multiple ? Label : React.Fragment;
  const componentProps =
    isCheckbox && !multiple
      ? { text: label, className: 'cursor-pointer', labelPosition, isInput: !isCheckbox }
      : {};

  const item = getItemOfOneType(childrens, [Checkbox, Radio, Toggle, Input, Select, Textarea]);

  if (item) {
    const childrenProps = {};
    if (formError) childrenProps.color = 'error';
    replaceItem(childrens, item, React.cloneElement(item, childrenProps));
  }

  return (
    <div className={`form-control ${className || ''}`}>
      <Component {...componentProps}>
        {typeof label !== 'undefined' && !isCheckbox && <Label text={label} />}
        {childrens}
      </Component>
      {formError && (
        <div className="label">
          <span className="label-text-alt font-inter text-black">
            <ExclamationIcon className="inline-block mr-1 h-4 text-error fill-current" />
            {formError.message}
          </span>
        </div>
      )}
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
  multiple: PropTypes.bool,
};

export default FormControl;
