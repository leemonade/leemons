import { Button } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import useDownloadStudentReport from './hooks/useDownloadStudentReport';

import { prefixPN } from '@scores/helpers';

export default function Footer({period}) {
  const [t] = useTranslateLoader(prefixPN('myScores'));

  const downloadStudentReport = useDownloadStudentReport();

  if (period === 'final') {
    return null;
  }

  return <Button onClick={downloadStudentReport}>{t('downloadReport')}</Button>;
}

Footer.propTypes = {
  period: PropTypes.string.isRequired,
};
