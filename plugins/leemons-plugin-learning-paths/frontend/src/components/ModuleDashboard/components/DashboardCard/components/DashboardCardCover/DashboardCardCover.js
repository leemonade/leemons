import React, { useMemo } from 'react';
import { Box, ImageLoader, CardEmptyCover, ProgressRing, Text } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@learning-paths/helpers/prefixPN';
import { isNil } from 'lodash';
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
  moduleColor,
  evaluationInfo,
  introductionCard,
}) => {
  const { classes } = DashboardCardCoverStyles({ moduleColor });
  const [t] = useTranslateLoader(prefixPN('dashboard'));
  const isSomethingEvaluable = ['someEvaluated', 'someDeliveredButNotAll'].includes(
    evaluationInfo?.state
  );
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
              src={emptyIcon}
            />
          </Box>
        }
        fileType={fileType}
      />
    ),
    [fileType]
  );

  if (cover) {
    return (
      <Box className={classes.root}>
        <ImageLoader src={cover} height={144} />
        <Box className={classes.orderLabel}>{assetNumber}</Box>
      </Box>
    );
  }
  if (isSomethingEvaluable) {
    const totalStudents = evaluationInfo?.totalStudents;
    const totalStudentsFinished = evaluationInfo?.totalStudentsFinished;
    const percentage = Math.round((totalStudentsFinished / totalStudents) * 100);
    return (
      <Box className={classes.commonContainer}>
        <Box className={classes.color} />

        <ProgressRing
          rootColor={'#DDE1E6'}
          sections={[{ value: percentage, color: '#307AE8' }]}
          label={
            <Box className={classes.labelPercentage}>
              <Text className={classes.textPercentage}>{`${percentage}%`}</Text>
            </Box>
          }
        />
        <Text>{`(${totalStudentsFinished}/${totalStudents} ${t('students')})`}</Text>
        <Box className={classes.orderLabel}>{assetNumber}</Box>
      </Box>
    );
  }
  if (!cover && fileType && introductionCard) {
    return (
      <Box className={classes.root}>
        {MemoizedEmptyCoverIntroduction}
        <Box className={classes.orderLabel}>{assetNumber}</Box>
      </Box>
    );
  }

  const { grades } = assignation;
  const isGradeAssigned = !isNil(
    Array.isArray(grades) && grades.length >= 1 && grades[0].grade !== null ? grades[0].grade : null
  );
  return (
    <Box className={classes.root}>
      <Box className={classes.color} />
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
      {!isGradeAssigned && asset?.cover && <ImageLoader src={asset?.cover} height={144} />}
      {!isGradeAssigned && !asset?.cover && MemoizedEmptyCoverAsset}
      <Box className={classes.orderLabel}>{assetNumber}</Box>
    </Box>
  );
};

DashboardCardCover.propTypes = DASHBOARD_CARD_COVER_PROP_TYPES;
DashboardCardCover.defaultProps = DASHBOARD_CARD_COVER_DEFAULT_PROPS;

export default DashboardCardCover;
export { DashboardCardCover };
