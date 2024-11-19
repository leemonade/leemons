import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

import { Box, Button } from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/solid';
import ContentEditorInput from '@common/components/ContentEditorInput/ContentEditorInput';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import propTypes from 'prop-types';

import { ContentToPrintStyles } from './ContentToPrint.styles';

import prefixPN from '@content-creator/helpers/prefixPN';
import { processContentForPDF } from '@content-creator/helpers/processContentForPDF';
import useDocument from '@content-creator/request/hooks/queries/useDocument';

const PrintContentButton = ({ content, title, assetId, variant = 'button', onTrigger }) => {
  const { classes } = ContentToPrintStyles({}, { name: 'ContentToPrint' });
  const [t] = useTranslateLoader(prefixPN('printContentButton'));

  const { data: documentData } = useDocument(
    {
      id: assetId,
      isNew: false,
    },
    { enabled: !!assetId }
  );

  const contentToProcess = documentData?.content ?? content;
  const processedContent = processContentForPDF(contentToProcess, t);
  const printRef = useRef();
  const printInstance = useRef();

  const handlePrint = () => {
    printInstance.current?.click();
  };

  React.useEffect(() => {
    if (onTrigger) {
      onTrigger(handlePrint);
    }
  }, [onTrigger]);

  const variantType = {
    button: <Button variant="outline">{t('printPDF')}</Button>,
    icon: <DownloadIcon width={18} height={18} color="#2F463F" />,
  };

  return (
    <>
      <Box style={{ display: 'none' }}>
        <ContentEditorInput
          ref={printRef}
          readOnly
          value={processedContent}
          editorClassname={classes.printEditor}
          compact
        />
      </Box>
      <ReactToPrint
        trigger={(props) => (
          <span {...props} ref={printInstance}>
            {variantType[variant]}
          </span>
        )}
        content={() => printRef.current}
        documentTitle={title ?? ''}
        removeAfterPrint
      />
    </>
  );
};

PrintContentButton.propTypes = {
  content: propTypes.string,
  title: propTypes.string,
  variant: propTypes.oneOf(['button', 'icon']),
  assetId: propTypes.string,
  onTrigger: propTypes.func,
};

export { PrintContentButton };
