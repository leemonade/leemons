import React from 'react';
import PropTypes from 'prop-types';

function AvatarGroup({ children, gap, placeholder, placeholderSize, className }) {
  const sizeClass = `w-${placeholderSize} h-${placeholderSize}`;
  return (
    <div className={`avatar-group -space-x-${gap} ${className || ''}`}>
      {children}
      {typeof placeholder !== 'undefined' && (
        <div className="avatar placeholder">
          <div className={`bg-neutral-focus text-neutral-content rounded-full ${sizeClass}`}>
            <span>{placeholder}</span>
          </div>
        </div>
      )}
    </div>
  );
}

AvatarGroup.defaultProps = {
  gap: 6,
  placeholderSize: 10,
};

AvatarGroup.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  gap: PropTypes.number,
  placeholder: PropTypes.any,
  placeholderSize: PropTypes.number,
};

export default AvatarGroup;
