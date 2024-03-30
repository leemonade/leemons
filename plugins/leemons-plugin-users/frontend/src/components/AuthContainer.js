import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Box, Stack } from '@bubbles-ui/components';

const AuthContainer = ({ children, ...props }) => (
  <Stack alignItems="center" sx={{ width: 310, minHeight: 'calc(100vh - 64px)' }}>
    <Box sx={{ width: '100%' }}>
      <ContextContainer {...props}>{children}</ContextContainer>
    </Box>
  </Stack>
);

AuthContainer.propTypes = {
  children: PropTypes.node,
};

export { AuthContainer };
