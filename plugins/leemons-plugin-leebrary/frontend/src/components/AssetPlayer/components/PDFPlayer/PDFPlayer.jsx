import React, { useState } from 'react';
import { Box, RadioGroup } from '@bubbles-ui/components';
import { ArrowRightIcon, ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { ComputerKeyboardIcon, ComputerKeyboardNextIcon, StarIcon } from '@bubbles-ui/icons/solid';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { PDF_PLAYER_DEFAULT_PROPS, PDF_PLAYER_PROP_TYPES } from './PDFPlayer.constants';
import { PDFPlayerStyles } from './PDFPlayer.styles';

const PDFPlayer = ({ pdf, labels, useSchema, className }) => {
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isThumbnailOpen, setIsThumbnailOpen] = useState(true);
  const [thumbnailMode, setThumbnailMode] = useState('thumbnail');
  const [isCurrentPageRendered, setIsCurrentPageRendered] = useState(false);

  const changePage = (page) => {
    setActivePage(page);
    setIsCurrentPageRendered(false);
  };

  const pageBackward = () => {
    if (activePage === 1) return;
    setActivePage((prev) => prev - 1);
    setIsCurrentPageRendered(false);
  };

  const pageForward = () => {
    if (activePage === totalPages) return;
    setActivePage((prev) => prev + 1);
    setIsCurrentPageRendered(false);
  };

  const modeChangeHandler = (mode) => {
    setThumbnailMode(mode);
  };

  const onLoadSuccessHandler = ({ numPages }) => {
    setTotalPages(numPages);
  };

  const { classes, cx } = PDFPlayerStyles(
    { isThumbnailOpen, isCurrentPageRendered, thumbnailMode },
    { name: 'PDFPlayer' }
  );
  return (
    <Document
      file={pdf}
      onLoadSuccess={onLoadSuccessHandler}
      className={cx(classes.document, className)}
    >
      {useSchema && (
        <Box className={classes.thumbnailContainer}>
          <Box className={classes.thumbnailTranslate}>
            <Box className={classes.thumbnailHeader}>
              <Box className={classes.schemaLabel}>{labels.schemaLabel}</Box>
              <ComputerKeyboardNextIcon
                className={classes.arrowIcon}
                height={20}
                width={20}
                onClick={() => setIsThumbnailOpen(!isThumbnailOpen)}
              />
            </Box>
            {/* 
            <Box className={classes.modeWrapper}>
              <RadioGroup
                value={thumbnailMode}
                data={[
                  { icon: <StarIcon />, value: 'thumbnail' },
                  { icon: <StarIcon />, value: 'schema' },
                ]}
                variant="icon"
                onChange={modeChangeHandler}
              />
            </Box>
            */}
            <Box className={classes.thumbnails}>
              {Array.from(new Array(totalPages), (el, index) => {
                const currentPage = index + 1;
                return (
                  <Box key={`page_${currentPage}`} className={classes.thumbnailWrapper}>
                    {thumbnailMode === 'thumbnail' && (
                      <Page
                        pageNumber={currentPage}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        width={90}
                        className={cx(classes.thumbnailPage, {
                          [classes.activeThumbnail]: currentPage === activePage,
                        })}
                        onClick={() => changePage(currentPage)}
                      />
                    )}
                    <Box
                      className={classes.pageLabel}
                      onClick={thumbnailMode !== 'thumbnail' ? () => changePage(currentPage) : null}
                    >{`${labels.pageLabel} ${currentPage}`}</Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}
      <Box className={classes.activePageContainer}>
        <Page
          pageNumber={activePage}
          className={classes.activePage}
          onRenderSuccess={() => setIsCurrentPageRendered(true)}
        />
        <Box className={classes.paginator}>
          <ChevLeftIcon
            height={24}
            width={24}
            className={cx(classes.paginatorIcon, { [classes.disabledIcon]: activePage === 1 })}
            onClick={() => pageBackward()}
          />
          <Box
            className={classes.paginatorLabel}
          >{`${activePage} ${labels.paginatorLabel} ${totalPages}`}</Box>
          <ChevRightIcon
            height={24}
            width={24}
            className={cx(classes.paginatorIcon, {
              [classes.disabledIcon]: activePage === totalPages,
            })}
            onClick={() => pageForward()}
          />
        </Box>
      </Box>
    </Document>
  );
};

PDFPlayer.defaultProps = PDF_PLAYER_DEFAULT_PROPS;
PDFPlayer.propTypes = PDF_PLAYER_PROP_TYPES;

export { PDFPlayer };
