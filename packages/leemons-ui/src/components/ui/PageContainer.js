import React from 'react';
import PropTypes from 'prop-types';

function PageContainer({ className, children }) {
  return <div className={`max-w-screen-xl w-full mx-auto p-6 ${className}`}>{children}</div>;
}

PageContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
};

export default PageContainer;
