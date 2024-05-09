import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from '@bubbles-ui/components';

function PointBar({ classes, cx, percentage, total, color, bottomText, label }) {
  return (
    <Box>
      <Box sx={() => ({ textAlign: 'center' })}>
        <Text strong color="primary">
          {percentage}%
        </Text>
        <Box className={classes.npsBar}>
          <Box
            className={classes.npsBarInside}
            sx={(theme) => ({
              height: `${percentage}%`,
              backgroundColor: color,
            })}
          />
          <Box sx={() => ({ position: 'relative' })}>
            <Text strong size="sm" color="quartiary">
              {total}
            </Text>
          </Box>
        </Box>
        <Box sx={(theme) => ({ marginTop: '8px' })}>
          <Text size="xs" color="secondary" strong>
            {bottomText}
          </Text>
        </Box>
        {label ? (
          <Box sx={(theme) => ({ marginTop: theme.spacing[6] })}>
            <Text role="productive">{label}</Text>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

PointBar.propTypes = {
  classes: PropTypes.any,
  cx: PropTypes.any,
  percentage: PropTypes.number,
  total: PropTypes.number,
  color: PropTypes.string,
  bottomText: PropTypes.string,
  colorFullToken: PropTypes.string,
};

export { PointBar };
