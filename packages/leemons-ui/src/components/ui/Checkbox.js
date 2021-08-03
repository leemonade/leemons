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
    const [checked, setChecked] = useState(defaultChecked);

    useEffect(() => {
      setChecked(defaultChecked);
    }, [defaultChecked]);

    const spanClick = () => {
      onChange(!checked);
      setChecked(!checked);
      onClick();
    };

    return (
      <div>
        <input
          ref={ref}
          type="checkbox"
          defaultChecked={checked}
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
