import React from 'react';
import { Box } from '@bubbles-ui/components';
import { ArrowUpIcon, ArrowDownIcon, SubtractIcon } from '@bubbles-ui/icons/outline';

const ArrowComponent = ({ state }) => {
  const iconToShow = {
    bad: <ArrowDownIcon />,
    better: <ArrowUpIcon />,
    equal: <SubtractIcon />,
  };
  return <Box>{iconToShow[state]}</Box>;
};

export default ArrowComponent;
export { ArrowComponent };
