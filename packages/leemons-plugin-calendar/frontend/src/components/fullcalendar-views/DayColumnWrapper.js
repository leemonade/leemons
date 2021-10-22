import React from 'react';

const DayColumnWrapper = React.forwardRef(({ children, ...rest }, ref) => (
  <div {...rest}>{children}</div>
));

export default DayColumnWrapper;
