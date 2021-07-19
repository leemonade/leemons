import React from 'react';
import PropTypes from 'prop-types';

function Label({ children, className, text, helper, labelPosition }) {
  const textClass = helper
    ? 'label-text-alt font-inter text-black'
    : 'label-text font-medium text-black';
  const positionClass = labelPosition === 'left' ? 'mr-3' : 'ml-3';
  return (
    <label className={`label ${className || ''}`}>
      {labelPosition === 'right' && children}
      {typeof text !== 'undefined' && (
        <span className={[textClass, positionClass].join(' ')}>{text}</span>
      )}
      {labelPosition === 'left' && children}
    </label>
  );
}

Label.defaultProps = {
  labelPosition: 'left',
};

Label.propTypes = {
  children: PropTypes.any,
  text: PropTypes.any,
  className: PropTypes.string,
  helper: PropTypes.bool,
  labelPosition: PropTypes.oneOf(['left', 'right']),
};

export default Label;
