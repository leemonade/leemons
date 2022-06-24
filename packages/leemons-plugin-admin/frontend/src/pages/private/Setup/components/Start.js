import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Button, ContextContainer, Paragraph } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';

const Start = ({ onNextLabel, onNext = () => {} }) => {
  const [t] = useTranslateLoader(prefixPN('setup'));

  // ····················································
  // HANDLERS
  const handleOnNext = () => {
    onNext();
  };

  return (
    <Box>
      <ContextContainer title={t('welcome.title')} divided>
        <Box>
          <Paragraph>{t('welcome.description')}</Paragraph>
        </Box>
        <Stack justifyContent="end">
          <Button onClick={handleOnNext}>{onNextLabel}</Button>
        </Stack>
      </ContextContainer>
    </Box>
  );
};

Start.defaultProps = {
  onNextLabel: 'Continue',
};
Start.propTypes = {
  onNext: PropTypes.func,
  onNextLabel: PropTypes.string,
};

export { Start };
export default Start;
