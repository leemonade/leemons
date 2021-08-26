import React, { createRef, useEffect, useState } from 'react';
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
    const inputRef = createRef();
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
          event.target.checked = checked.checked;
        }
        onChange(event);
        setChecked({ checked: event.target.checked, fromClick: false });
      }
    };

    return (
      <div>
        <input
          ref={(e) => {
            inputRef.current = e;
            if (ref) ref.current = e;
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

Checkbox.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['neutral', 'primary', 'secondary', 'accent', 'error']),
};

export default Checkbox;
