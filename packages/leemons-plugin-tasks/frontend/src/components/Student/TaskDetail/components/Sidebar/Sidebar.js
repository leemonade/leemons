import React from 'react';
import { Box, ContextContainer } from '@bubbles-ui/components';

export default function Sidebar({ assignation, show = true, className }) {
  if (show) {
    return (
      <Box className={className}>
        <ContextContainer title="Resources"></ContextContainer>
        <ContextContainer title="Your team"></ContextContainer>
      </Box>
    );
  }
  return null;
}
