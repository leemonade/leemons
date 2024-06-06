import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper } from '@bubbles-ui/components';

function Tooltip({ value, indexValue, id, color }) {
  if (id === 'diff') {
    return null;
  }
  return (
    <Paper>
      <Box sx={{ maxWidth: 200 }}>
        {indexValue}: <strong>{value}</strong>
      </Box>
    </Paper>
  );
}

Tooltip.propTypes = {
  value: PropTypes.number,
  color: PropTypes.string,
  indexValue: PropTypes.string,
  id: PropTypes.string,
};

export { Tooltip };
