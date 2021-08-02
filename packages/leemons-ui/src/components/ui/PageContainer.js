import React from 'react';
import PropTypes from 'prop-types';

function PageContainer({ className, children, bottomBorder }) {
  return (
    <div
      className={`max-w-screen-xl w-full mx-auto p-6 ${
        bottomBorder && 'border-b border-base-300'
      } ${className}`}
    >
      {children}
    </div>
  );
}

PageContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  bottomBorder: PropTypes.bool,
};

export default PageContainer;
