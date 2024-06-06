import React from 'react';

import { Alert } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';

function FinishedAlert() {
  const [t] = useTranslateLoader(prefixPN('evaluation.finished_alert'));
  return <Alert severity="success" title={t('title')} closeable={false} />;
}

export default FinishedAlert;
