import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Checkbox = React.forwardRef(
  (
    {
      className,
      color,
      onClick = () => {},
      checked: defaultChecked = false,
      onChange = () => {},
      ...props
    },
    ref
  ) => {
    const colorClass = color ? `checkbox-${color}` : '';
    const [checked, setChecked] = useState({ checked: defaultChecked, fromClick: false });

    useEffect(() => {
      setChecked({ checked: defaultChecked, fromClick: false });
    }, [defaultChecked]);

    const spanClick = () => {
      setChecked({ checked: !checked.checked, fromClick: true });
      onClick();
    };

    const customOnChange = (event) => {
      if (checked.fromClick) {
        event.target.checked = checked.checked;
      }
      onChange(event);
      setChecked({ checked: event.target.checked, fromClick: false });
    };

    return (
      <div>
        <input
          ref={ref}
          type="checkbox"
          checked={checked.checked}
          onChange={customOnChange}
          className={`checkbox ${colorClass} ${className || ''}`}
          {...props}
        />
        <span className="checkbox-mark" onClick={spanClick}></span>
      </div>
    );
  }
);

Checkbox.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['neutral', 'primary', 'secondary', 'accent']),
};

export default Checkbox;
