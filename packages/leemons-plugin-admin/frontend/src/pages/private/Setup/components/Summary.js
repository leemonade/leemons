import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Button, ContextContainer, Paragraph } from '@bubbles-ui/components';

const Summary = ({ onNextLabel, onNext = () => {} }) => {
  // ····················································
  // HANDLERS
  const handleOnNext = () => {
    onNext();
  };

  return (
    <Box>
      <ContextContainer title="Super-admin setup" divided>
        <Box>
          <Paragraph>
            This brief guide explain the main points of each mandatory step in order to setup the
            platform for a super-admin user like you.
          </Paragraph>
        </Box>
        <Stack justifyContent="end">
          <Button onClick={handleOnNext}>{onNextLabel}</Button>
        </Stack>
      </ContextContainer>
    </Box>
  );
};

Summary.defaultProps = {
  onNextLabel: 'Continue',
};
Summary.propTypes = {
  onNext: PropTypes.func,
  onNextLabel: PropTypes.string,
};

export { Summary };
export default Summary;
