/* eslint-disable prettier/prettier */
import React from 'react';
import { Box, Button, createStyles, Tooltip } from '@bubbles-ui/components';
import propTypes from 'prop-types';
import { addAction, fireEvent, removeAction } from 'leemons-hooks';
import { addErrorAlert } from '@layout/alert';
import { useIsStudent } from '@academic-portfolio/hooks';
import { DownloadIcon, ListEditIcon } from '@bubbles-ui/icons/outline';

const useStyles = createStyles((theme, { isStudent }) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    // padding: isStudent ? '16px 48px' : `${theme.spacing[3]}px ${theme.spacing[5]}px`,
  },
  title: {
    span: isStudent
      ? {
          color: theme.other.global.content.color.text.default,
          ...theme.other.global.content.typo.heading.lg,
        }
      : {},
    flex: 1,
  },
}));

export function onScoresDownload(extension) {
  let timer;
  const downloadScoresError = 'scores::download-scores-error';
  const onClearTimer = () => {
    clearTimeout(timer);

    removeAction('scores::downloaded-intercepted', onClearTimer);
  };

  const onError = ({ args: [e] }) => {
    addErrorAlert(`Error downloading scores report ${e.message}`);

    removeAction(downloadScoresError, onError);
  };

  addAction('scores::downloaded-intercepted', onClearTimer);
  addAction(downloadScoresError, onError);

  fireEvent('scores::download-scores', extension);
  timer = setTimeout(() => {
    fireEvent(downloadScoresError, new Error('timeout'));
  }, 1000);
}
const ScoresFooter = ({
  allowDownload,
  showEvaluationReport,
  evaluationReportLabels,
  evaluationType,
  isPeriodSubmitted,
  showEvaluationReportModal,
}) => {
  const isStudent = useIsStudent();
  const { classes } = useStyles({ isStudent });

  return (
    <Box className={classes.root}>
      {allowDownload && (
        <>
          <Button
            variant="link"
            size="sm"
            position="center"
            leftIcon={<DownloadIcon />}
            onClick={() => onScoresDownload('xlsx')}
          >
            Excel
          </Button>
          <Button
            variant="link"
            size="sm"
            position="center"
            leftIcon={<DownloadIcon />}
            onClick={() => onScoresDownload('csv')}
          >
            CSV
          </Button>
        </>
      )}
      {!!showEvaluationReport && (
        <Button size="sm" rightIcon={<ListEditIcon />} onClick={showEvaluationReportModal}>
          {evaluationReportLabels?.[evaluationType]?.label}
        </Button>
      )}
    </Box>
  );
};

ScoresFooter.propTypes = {
  allowDownload: propTypes.bool,
  showEvaluationReport: propTypes.bool,
  evaluationReportLabels: propTypes.object,
  evaluationType: propTypes.string,
  isPeriodSubmitted: propTypes.bool,
  showEvaluationReportModal: propTypes.func,
};

export default ScoresFooter;
export { ScoresFooter };
