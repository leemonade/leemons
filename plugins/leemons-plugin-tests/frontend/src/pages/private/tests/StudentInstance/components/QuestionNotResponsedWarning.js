/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Box } from '@bubbles-ui/components';

export default function QuestionNotResponsedWarning({ t }) {
  return (
    <Box sx={(theme) => ({ marginBottom: theme.spacing[2] })}>
      <Alert title={t('warnNoResponseTitle')} severity="warning" closeable={false}>
        {t('warnNoResponseDescription')}
      </Alert>
    </Box>
  );
}

QuestionNotResponsedWarning.propTypes = {
  t: PropTypes.any,
};
