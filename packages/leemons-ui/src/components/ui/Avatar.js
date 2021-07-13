import React from 'react';
import PropTypes from 'prop-types';

function Avatar({ children, type, className }) {
  return (
    <div className={`avatar ${type || ''}`}>
      <div className={className}>{children}</div>
    </div>
  );
}

Avatar.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  type: PropTypes.string,
};

export default Avatar;
