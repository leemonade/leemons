import React from 'react';
import PropTypes from 'prop-types';

import { Stack, Text, Box, TextClamp } from '@bubbles-ui/components';

export default function NameRenderer({
  value,
  row: {
    original: { icon },
  },
}) {
  return (
    <Stack spacing={2} alignItems="center">
      {!!icon && (
        <Box sx={{ position: 'relative', width: 18, height: 18 }}>
          {React.cloneElement(icon, { width: 18, height: 18 })}
        </Box>
      )}
      <Box sx={{ maxWidth: 346 }}>
        <TextClamp lines={1} maxLines={1}>
          <Text transform="capitalize">{value}</Text>
        </TextClamp>
      </Box>
    </Stack>
  );
}

NameRenderer.propTypes = {
  value: PropTypes.string.isRequired,
  row: PropTypes.shape({
    original: PropTypes.shape({
      icon: PropTypes.node,
    }),
  }).isRequired,
};
