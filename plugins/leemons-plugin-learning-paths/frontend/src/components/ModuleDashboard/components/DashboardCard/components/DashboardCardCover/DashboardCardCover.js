import React, { useMemo } from 'react';
import { Box, ImageLoader, CardEmptyCover } from '@bubbles-ui/components';
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
  cover,
  emptyIcon,
  fileType,
}) => {
  const { classes } = DashboardCardCoverStyles();

  const MemoizedEmptyCoverIntroduction = useMemo(
    () => (
      <CardEmptyCover
        icon={
          <Box
            style={{
              position: 'relative',
            }}
          >
            <ImageLoader
              style={{
                width: 24,
                height: 24,
                position: 'relative',
              }}
              width={24}
              height={24}
              src={emptyIcon}
            />
          </Box>
        }
        fileType={fileType}
      />
    ),
    [emptyIcon]
  );
  if (cover) {
    return (
      <Box className={classes.root}>
        <ImageLoader src={cover} height={144} />
        <Box className={classes.orderLabel}>{assetNumber}</Box>
      </Box>
    );
  }
  if (!cover && fileType) {
    return (
      <Box className={classes.root}>
        {MemoizedEmptyCoverIntroduction}
        <Box className={classes.orderLabel}>{assetNumber}</Box>
      </Box>
    );
  }

  const assetType = instance?.assignable?.roleDetails?.name;

  const MemoizedEmptyCoverAsset = useMemo(
    () => (
      <CardEmptyCover
        icon={
          <Box style={{ position: 'relative' }}>
            <ImageLoader
              style={{
                width: 24,
                height: 24,
                position: 'relative',
              }}
              width={24}
              height={24}
              src={asset?.cover}
            />
          </Box>
        }
        fileType={assetType}
      />
    ),
    [asset, assetType]
  );
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
      {!isGradeAssigned && !asset?.cover && MemoizedEmptyCoverAsset}
      <Box className={classes.orderLabel}>{assetNumber}</Box>
    </Box>
  );
};

DashboardCardCover.propTypes = DASHBOARD_CARD_COVER_PROP_TYPES;
DashboardCardCover.defaultProps = DASHBOARD_CARD_COVER_DEFAULT_PROPS;

export default DashboardCardCover;
export { DashboardCardCover };
