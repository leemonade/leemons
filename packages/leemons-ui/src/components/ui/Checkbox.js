import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Checkbox = React.forwardRef(
  (
    {
      className,
      color,
      readOnly,
      onClick = () => {},
      checked: defaultChecked = false,
      onChange = () => {},
      ...props
    },
    ref
  ) => {
    const inputRef = ref && typeof ref !== 'function' ? ref : useRef();
    const colorClass = color ? `checkbox-${color}` : '';
    const [checked, setChecked] = useState({ checked: defaultChecked, fromClick: false });

    useEffect(() => {
      if (checked.checked !== defaultChecked) {
        setChecked({ checked: defaultChecked, fromClick: false });
      }
    }, [defaultChecked]);

    const spanClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!readOnly) {
        setChecked({ checked: !checked.checked, fromClick: true });
        const ev = new Event('change', { bubbles: true });
        inputRef.current.dispatchEvent(ev);
        ev.target.checked = !checked.checked;
        onChange(ev);
        onClick();
      }
    };

    const customOnChange = (event) => {
      if (!readOnly) {
        if (checked.fromClick) {
          inputRef.current.checked = checked.checked;
        }
        if (event.target === inputRef.current) {
          setChecked({ checked: inputRef.current.checked, fromClick: false });
        } else {
          setChecked((_checked) => ({ checked: !_checked.checked, fromClick: false }));
        }
        onChange(event);
      }
    };

    return (
      <div>
        <input
          ref={(e) => {
            if (typeof ref === 'function') {
              ref(e);
            }
            inputRef.current = e;
          }}
          type="checkbox"
          checked={checked.checked}
          onChange={customOnChange}
          className={`checkbox ${colorClass} ${className || ''}`}
          {...props}
        />
        <span
          className="checkbox-mark"
          onClick={(e) => {
            if (!props.disabled) spanClick(e);
          }}
        />
      </div>
    );
  }
);

export default Checkbox;
