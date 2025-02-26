import { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';

import { Box, Button } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import propTypes from 'prop-types';

import { ReportCard } from './ReportCard';

import { prefixPN } from '@scores/helpers';

const PrintReportButton = ({ title }) => {
  const [t] = useTranslateLoader(prefixPN('myScores'));
  const [isLoading, setIsLoading] = useState(false);

  // ·························································
  // RENDER

  const printRef = useRef();

  return (
    <>
      <Box style={{ display: 'none' }}>
        <ReportCard ref={printRef} onLoading={setIsLoading} />
      </Box>
      <ReactToPrint
        trigger={(props) => (
          <Button {...props} loading={isLoading}>
            {t('downloadReport')}
          </Button>
        )}
        content={() => printRef.current}
        documentTitle={title ?? ''}
        removeAfterPrint
      />
    </>
  );
};

PrintReportButton.propTypes = {
  title: propTypes.string,
};

export { PrintReportButton };
