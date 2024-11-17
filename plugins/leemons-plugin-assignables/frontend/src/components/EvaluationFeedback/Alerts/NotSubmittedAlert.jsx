import React from 'react';

import { Alert } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';

function NotSubmittedAlert() {
  const [t] = useTranslateLoader(prefixPN('evaluation.not_submitted_alert'));

  return <Alert severity="error" title={t('title')} closeable={false} />;
}

export default NotSubmittedAlert;
