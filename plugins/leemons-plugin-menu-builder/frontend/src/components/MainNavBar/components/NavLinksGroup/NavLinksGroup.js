import React from 'react';
import { Box } from '@bubbles-ui/components';

export function NavbarLinksGroup({ data }) {
  return (
    <Box
      sx={(theme) => ({
        minHeight: 200,
        padding: theme.spacing.md,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
      })}
    >
      <NavItem {...data} />
    </Box>
  );
}
