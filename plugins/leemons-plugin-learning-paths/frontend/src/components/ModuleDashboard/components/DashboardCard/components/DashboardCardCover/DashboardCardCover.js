import { useMemo } from 'react';

import { Box, ImageLoader, CardEmptyCover, ProgressRing, Text } from '@bubbles-ui/components';
import Cover from '@leebrary/components/Cover';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isNil } from 'lodash';

import { ScoreFeedback } from '../ScoreFeedback';

import {
  DASHBOARD_CARD_COVER_DEFAULT_PROPS,
  DASHBOARD_CARD_COVER_PROP_TYPES,
} from './DashboardCardCover.constants';
import { DashboardCardCoverStyles } from './DashboardCardCover.styles';

import prefixPN from '@learning-paths/helpers/prefixPN';

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
  evaluationInfo,
  introductionCard,
  subjects,
}) => {
  const isMultiSubject = Array.isArray(subjects) && subjects?.length > 1;
  const subjectColor = isMultiSubject ? 'rgb(135, 141, 150)' : subjects?.[0]?.color;
  const { classes } = DashboardCardCoverStyles({ subjectColor });
  const [t] = useTranslateLoader(prefixPN('dashboard'));
  const deliveredBySomeone = [
    'someDeliveredButNotAll',
    'allEvaluated',
    'someEvaluated',
    'allFinished',
  ].includes(evaluationInfo?.state);

  const isAllEvaluated = evaluationInfo?.state === 'allEvaluated';

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
        <Cover asset={asset} height={144} hideCopyright />
        <Box className={classes.orderLabel}>{assetNumber}</Box>
      </Box>
    );
  }
  if (deliveredBySomeone) {
    const totalStudents = evaluationInfo?.totalStudents;
    const totalStudentsFinished = evaluationInfo?.totalStudentsFinished;
    const percentage = Math.round((totalStudentsFinished / totalStudents) * 100);
    return (
      <Box className={classes.commonContainer}>
        <Box className={classes.color} />
        <ProgressRing
          rootColor={'#DDE1E6'}
          sections={[{ value: isAllEvaluated ? 100 : percentage, color: '#307AE8' }]}
          label={
            <Box className={classes.labelPercentage}>
              <Text className={classes.textPercentage}>{`${
                isAllEvaluated ? 100 : percentage
              }%`}</Text>
            </Box>
          }
        />
        <Text>
          {isAllEvaluated
            ? t('allStudentsEvaluated')
            : `(${totalStudentsFinished}/${totalStudents} ${t('students')?.toLowerCase()})`}
        </Text>
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

      {!isGradeAssigned && asset?.cover && (
        <Cover asset={asset} height={144} copyrightAlign="right" hideCopyright />
      )}
      {!isGradeAssigned && !asset?.cover && MemoizedEmptyCoverAsset}
      <Box className={classes.orderLabel}>{assetNumber}</Box>
    </Box>
  );
};

DashboardCardCover.propTypes = DASHBOARD_CARD_COVER_PROP_TYPES;
DashboardCardCover.defaultProps = DASHBOARD_CARD_COVER_DEFAULT_PROPS;

export default DashboardCardCover;
export { DashboardCardCover };
