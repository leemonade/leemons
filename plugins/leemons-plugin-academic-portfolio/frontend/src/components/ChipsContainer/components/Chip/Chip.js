import React, { forwardRef } from 'react';
import { Box, Text } from '@bubbles-ui/components';
import propTypes from 'prop-types';
import { ChipStyles } from './Chip.styles';

const Chip = forwardRef(({ subject, isHidden, isCollisionDetected }, ref) => {
  const { classes } = ChipStyles({ isCollisionDetected }, { name: 'Chip' });
  const style = isHidden ? { visibility: 'hidden', position: 'absolute' } : {};
  return (
    <Box ref={ref} className={classes.root} style={style}>
      <Text className={classes.label}>{subject}</Text>
    </Box>
  );
});

Chip.propTypes = {
  subject: propTypes.string.isRequired,
  isHidden: propTypes.bool.isRequired,
  isCollisionDetected: propTypes.bool,
};

Chip.displayName = 'Chip';
export { Chip };
