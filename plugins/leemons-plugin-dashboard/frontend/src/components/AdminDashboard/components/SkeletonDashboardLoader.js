import React from 'react';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';

const SkeletonDashboardLoader = ({ children, ...props }) => (
  <ContentLoader
    speed={2}
    width={'100%'}
    backgroundColor="#f7f8fa"
    foregroundColor="#d9dde2"
    {...props}
  >
    {children}
  </ContentLoader>
);

SkeletonDashboardLoader.propTypes = {
  children: PropTypes.node,
};

export { SkeletonDashboardLoader };
