import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

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

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: title ?? '',
    removeAfterPrint: true,
  });

  return (
    <>
      <Box style={{ display: 'none' }}>
        <ReportCard ref={printRef} onLoading={setIsLoading} />
      </Box>

      <Button onClick={handlePrint} loading={isLoading}>
        {t('downloadReport')}
      </Button>
    </>
  );
};

PrintReportButton.propTypes = {
  title: propTypes.string,
};

export { PrintReportButton };
