import * as _ from 'lodash';
import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Badge from './Badge';
import { XIcon } from '@heroicons/react/outline';

function getAllOptions(children) {
  const childrens = React.Children.toArray(children);
  let options = [];
  _.forEach(childrens, (child) => {
    if (child.type === 'option') {
      options.push({
        label: child.props.children,
        disabled: child.props.disabled,
        selected: child.props.selected,
        value: child.props.value || child.props.children,
      });
    } else if (child.props?.children) {
      options.concat(options, getAllOptions(child.props?.children));
    }
  });
  return options;
}

const Select = React.forwardRef(
  (
    {
      children,
      className,
      outlined,
      readOnly,
      color,
      onChange = () => {},
      multiple,
      value,
      ...props
    },
    ref
  ) => {
    const filterOptions = (options, _items) => {
      if (!multiple) return options;
      const result = [];
      const goodItems = _items || items || [];
      _.forEach(options, (option) => {
        if (goodItems.indexOf(option.value) < 0) result.push(option);
      });
      return result;
    };

    const onChangeMultiple = (e) => {
      setItems([...items, e.target.value]);
    };

    const removeItem = (item) => {
      const index = items.indexOf(item);
      if (index >= 0) {
        items.splice(index, 1);
        setItems([...items]);
      }
    };

    const inputRef = createRef();
    const colorClass = color ? `select-${color}` : '';
    const outlinedClass = outlined ? 'select-bordered' : '';
    const classes = className?.split(' ') || [];
    const selectClasses = classes.filter((item) => item.trim().indexOf('select-') === 0);
    const wrapperClasses = classes.filter((item) => item.trim().indexOf('select-') < 0);
    const __options = getAllOptions(children) || [];
    const __value = value || [];

    let __defaultOption = _.find(__options, { selected: true, disabled: true });
    if (!__defaultOption && multiple) {
      __defaultOption = {
        label: '-',
        value: '-',
        selected: true,
        disabled: true,
      };
      __options.unshift(__defaultOption);
    } else if (_.isArray(__options) && __options.length) {
      __defaultOption = __options[0];
    }

    const [items, setItems] = useState(__value);
    const [options, setOptions] = useState(
      filterOptions(getAllOptions(children) || [], value || [])
    );
    const [defaultOption, setDefaultOption] = useState(__defaultOption);
    const [originalOptionsByValue, setOriginalOptionsByValue] = useState(
      _.keyBy(__options, 'value')
    );

    useEffect(() => {
      if (!value && defaultOption && defaultOption.value && !multiple) {
        const ev = new Event('change', { bubbles: true });
        inputRef.current.dispatchEvent(ev);
        ev.target.checked = defaultOption.value;
        onChange(ev);
      }
    }, []);

    useEffect(() => {
      let _options = getAllOptions(children);
      if (!_.isEqual(_options, _.values(originalOptionsByValue))) {
        const defaultOption = _.find(_options, { selected: true, disabled: true });
        if (defaultOption) {
          setDefaultOption(defaultOption);
        } else if (multiple) {
          const def = {
            label: '-',
            value: '-',
            selected: true,
            disabled: true,
          };
          setDefaultOption(def);
          _options.unshift(def);
        }
        setOriginalOptionsByValue(_.keyBy(_options, 'value'));
        setOptions(filterOptions(_options));
      }
    }, [children]);

    useEffect(() => {
      if (multiple) setItems(value || []);
    }, [value]);

    useEffect(() => {
      setOptions(filterOptions(_.values(originalOptionsByValue)));
      if (multiple) onChange(items);
    }, [items]);

    return (
      <>
        {readOnly ? null : (
          <div className={`self-start select-wrapper ${wrapperClasses.join(' ')}`}>
            <select
              ref={(e) => {
                inputRef.current = e;
                if (ref) ref(e);
              }}
              value={multiple ? defaultOption.value : value}
              className={['select', colorClass, outlinedClass, selectClasses.join(' ')].join(' ')}
              onChange={multiple ? onChangeMultiple : onChange}
              {...props}
            >
              {options.map((option, index) => (
                <option
                  key={index}
                  value={option.value}
                  disabled={option.disabled}
                  selected={option.selected}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {!multiple && readOnly ? <>{value}</> : null}

        {multiple && items.length ? (
          <div className="pt-4">
            {items.map((item) => (
              <div className="inline-block p-1" key={item}>
                <Badge outlined={true}>
                  {readOnly ? null : (
                    <XIcon
                      className="inline-block w-4 h-4 mr-2 stroke-current cursor-pointer"
                      onClick={() => removeItem(item)}
                    />
                  )}

                  {originalOptionsByValue[item]?.label || item}
                </Badge>
              </div>
            ))}
          </div>
        ) : null}
      </>
    );
  }
);

Select.displayName = 'Select';

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
