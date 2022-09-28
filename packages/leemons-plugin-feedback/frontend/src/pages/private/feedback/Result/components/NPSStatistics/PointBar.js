import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from '@bubbles-ui/components';

function PointBar({ classes, cx, percentage }) {
  return (
    <Box>
      <Box sx={() => ({ textAlign: 'center' })}>
        <Text strong color="tertiary">
          {percentage}%
        </Text>
      </Box>
    </Box>
  );
}

PointBar.propTypes = {
  classes: PropTypes.any,
  cx: PropTypes.any,
  percentage: PropTypes.number,
};

export { PointBar };
