import React from 'react';
import PropTypes from 'prop-types';

function Label({ children, className, text }) {
  return (
    <label className={`label ${className || ''}`}>
      <span className="label-text">{text}</span>
      {children}
    </label>
  );
}

Label.propTypes = {
  children: PropTypes.any,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default Label;
