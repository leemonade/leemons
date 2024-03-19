import React from 'react';

import { Alert } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';

function PendingEvaluationAlert() {
  const [t] = useTranslateLoader(prefixPN('evaluation.pending_evaluation_alert'));
  return (
    <Alert severity="warning" title={t('title')} closeable={false}>
      {t('message')}
    </Alert>
  );
}

export default PendingEvaluationAlert;
