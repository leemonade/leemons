import React from 'react';
import PropTypes from 'prop-types';

import { Alert } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';

function SubmittedAlert({ onClose }) {
  const [t] = useTranslateLoader(prefixPN('evaluation.submitted_alert'));

  return (
    <Alert severity="success" title={t('title')} onClose={onClose}>
      {t('message')}
    </Alert>
  );
}

SubmittedAlert.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SubmittedAlert;
