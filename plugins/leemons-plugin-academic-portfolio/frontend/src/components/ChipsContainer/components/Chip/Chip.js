import React, { forwardRef } from 'react';
import { Box, Text } from '@bubbles-ui/components';
import propTypes from 'prop-types';
import { ChipStyles } from './Chip.styles';

const Chip = forwardRef(({ subject, isHidden }, ref) => {
  const { classes } = ChipStyles({}, { name: 'Chip' });
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
};

Chip.displayName = 'Chip';
export { Chip };
