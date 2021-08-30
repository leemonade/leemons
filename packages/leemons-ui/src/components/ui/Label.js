import React from 'react';
import PropTypes from 'prop-types';

function Label({ children, className, text, helper, labelPosition, isInput }) {
  const textClass = helper
    ? 'label-text-alt font-inter text-black'
    : `label-text ${isInput ? 'font-medium' : ''} text-black`;
  const positionClass = labelPosition === 'left' ? 'mr-3' : 'ml-3';
  const labelClass = labelPosition === 'right' ? 'justify-start' : '';
  return (
    <label className={`label ${className || ''} ${labelClass}`}>
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
  isInput: true,
};

Label.propTypes = {
  children: PropTypes.any,
  text: PropTypes.any,
  className: PropTypes.string,
  helper: PropTypes.bool,
  labelPosition: PropTypes.oneOf(['left', 'right']),
  isInput: PropTypes.bool,
};

export default Label;
