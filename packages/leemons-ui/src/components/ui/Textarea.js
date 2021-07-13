import React from 'react';
import PropTypes from 'prop-types';

function Textarea({ className, ...props }) {
  return <textarea className={`textarea ${className || ''}`} {...props}></textarea>;
}

Textarea.propTypes = {
  className: PropTypes.string,
};

export default Textarea;
