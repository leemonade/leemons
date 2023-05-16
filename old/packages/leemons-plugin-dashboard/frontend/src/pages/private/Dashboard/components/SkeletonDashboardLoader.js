import React from 'react';
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

export default SkeletonDashboardLoader;
