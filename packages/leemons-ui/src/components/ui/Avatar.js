import React from 'react';
import PropTypes from 'prop-types';

function Avatar({ children, type, rounded, size, circle, className }) {
  let roundedClass = rounded ? 'rounded-btn' : '';
  roundedClass = circle ? 'rounded-full' : roundedClass;
  const sizeClass = `w-${size} h-${size}`;
  return (
    <div className={`avatar ${type || ''}`}>
      <div className={[roundedClass, sizeClass, className].join(' ')}>{children}</div>
    </div>
  );
}

Avatar.defaultProps = {
  size: 8,
};

Avatar.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  type: PropTypes.string,
  rounded: PropTypes.bool,
  size: PropTypes.number,
  circle: PropTypes.bool,
};

export default Avatar;
