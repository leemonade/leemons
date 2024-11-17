import React from 'react';

import { Button } from '@bubbles-ui/components';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useDownloadStudentReport from './hooks/useDownloadStudentReport';

export default function Footer() {
  const [t] = useTranslateLoader(prefixPN('myScores'));

  const downloadStudentReport = useDownloadStudentReport();

  return <Button onClick={downloadStudentReport}>{t('downloadReport')}</Button>;
}
