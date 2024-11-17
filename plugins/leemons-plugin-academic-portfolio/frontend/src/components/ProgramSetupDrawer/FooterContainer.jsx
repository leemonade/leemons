import React from 'react';
import PropTypes from 'prop-types';
import { Box, TotalLayoutFooterContainer } from '@bubbles-ui/components';

const FooterContainer = ({ children, scrollRef }) => (
  <Box sx={() => ({ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 })}>
    <TotalLayoutFooterContainer scrollRef={scrollRef}>{children}</TotalLayoutFooterContainer>
  </Box>
);

FooterContainer.propTypes = {
  children: PropTypes.node.isRequired,
  scrollRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};

export default FooterContainer;
