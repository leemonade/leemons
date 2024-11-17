import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Text } from '@bubbles-ui/components';

function PcValue({ text, value }) {
  return (
    <Stack
      fullWidth
      justifyContent="space-between"
      sx={(theme) => ({ paddingTop: theme.spacing[1] })}
    >
      <Text strong color="primary" role="productive">
        {text}
      </Text>
      <Text color="secondary" role="productive">
        {value}
      </Text>
    </Stack>
  );
}

PcValue.propTypes = { text: PropTypes.string, value: PropTypes.any };

export { PcValue };
