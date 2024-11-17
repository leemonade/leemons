import React from 'react';
import { Box, Text, TextClamp, Stack } from '@bubbles-ui/components';
import { PeriodHeaderStyles } from './PeriodHeader.styles';
import { PERIOD_HEADER_DEFAULT_PROPS, PERIOD_HEADER_PROP_TYPES } from './PeriodHeader.constants';

const PeriodHeader = ({ name, isFirst, isLast, index, length }) => {
  const { classes, cx } = PeriodHeaderStyles(
    { isFirst, isLast, index, length },
    { name: 'PeriodHeader' }
  );

  return (
    <Box className={classes.root}>
      <Text color="primary" role="productive" stronger>
        {name}
      </Text>
    </Box>
  );
};

PeriodHeader.defaultProps = PERIOD_HEADER_DEFAULT_PROPS;
PeriodHeader.propTypes = PERIOD_HEADER_PROP_TYPES;

export { PeriodHeader };
