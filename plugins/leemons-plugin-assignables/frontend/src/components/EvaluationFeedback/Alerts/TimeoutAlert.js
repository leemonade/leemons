import React from 'react';
import PropTypes from 'prop-types';

import { Alert } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';

function TimeoutAlert({ onClose }) {
  const [t] = useTranslateLoader(prefixPN('evaluation.timeoutAlert'));
  return (
    <Alert severity="error" title={t('title')} onClose={onClose}>
      {t('message')}
    </Alert>
  );
}

TimeoutAlert.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default TimeoutAlert;
