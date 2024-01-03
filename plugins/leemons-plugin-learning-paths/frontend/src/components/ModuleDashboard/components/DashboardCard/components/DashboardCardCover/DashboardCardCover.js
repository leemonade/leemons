import React from 'react';
import { Box, ImageLoader } from '@bubbles-ui/components';
import {
  DASHBOARD_CARD_COVER_DEFAULT_PROPS,
  DASHBOARD_CARD_COVER_PROP_TYPES,
} from './DashboardCardCover.constants';
import { DashboardCardCoverStyles } from './DashboardCardCover.styles';
import { ScoreFeedback } from '../ScoreFeedback';

const DashboardCardCover = ({
  asset,
  assetNumber,
  assignation,
  score,
  program,
  isCalificable,
  instance,
}) => {
  const { classes } = DashboardCardCoverStyles();
  const { grades } = assignation;
  const isGradeAssigned =
    Array.isArray(grades) && grades.length >= 1 && grades[0].grade !== null
      ? grades[0].grade
      : null;

  return (
    <Box className={classes.root}>
      {isGradeAssigned && (
        <Box className={classes.gradeLabel}>
          <ScoreFeedback
            score={score}
            isCalificable={isCalificable}
            program={program}
            instance={instance}
          />
        </Box>
      )}
      {!isGradeAssigned && <ImageLoader src={asset?.cover} height={144} />}
      <Box className={classes.orderLabel}>{assetNumber}</Box>
    </Box>
  );
};

DashboardCardCover.propTypes = DASHBOARD_CARD_COVER_PROP_TYPES;
DashboardCardCover.defaultProps = DASHBOARD_CARD_COVER_DEFAULT_PROPS;

export default DashboardCardCover;
export { DashboardCardCover };
