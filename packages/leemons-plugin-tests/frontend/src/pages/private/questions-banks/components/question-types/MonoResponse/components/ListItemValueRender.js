import React from 'react';
import { Box } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export function ListItemValueRender({ ...props }) {
  console.log('ListItemValueRender', props);

  return <Box>Hola</Box>;
}

ListItemValueRender.propTypes = {};
