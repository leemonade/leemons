import React from 'react';
import { Box } from '@bubbles-ui/components';
import { ArrowUpIcon, ArrowDownIcon, SubtractIcon } from '@bubbles-ui/icons/outline';
import { ARROWCOMPONENT_PROPTYPES, ARROWCOMPONENT_DEFAULT_PROPS } from './ArrowComponent.constants';

const ArrowComponent = ({ state }) => {
  const iconToShow = {
    bad: <ArrowDownIcon color={'#B52A2A'} width={18} height={18} />,
    better: <ArrowUpIcon color={'#44A552'} width={18} height={18} />,
    equal: <SubtractIcon width={18} height={18} />,
  };
  return <Box>{iconToShow[state]}</Box>;
};

export default ArrowComponent;
export { ArrowComponent };

ArrowComponent.propTypes = ARROWCOMPONENT_PROPTYPES;
ArrowComponent.defaultProps = ARROWCOMPONENT_DEFAULT_PROPS;
ArrowComponent.displayName = 'ArrowComponent';
