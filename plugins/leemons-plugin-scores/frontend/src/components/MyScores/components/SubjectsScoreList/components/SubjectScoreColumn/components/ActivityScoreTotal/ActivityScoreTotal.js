import { useEffect } from 'react';

import { Stack, Text } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import getNearestScale from '@scorm/helpers/getNearestScale';
import { isNil, sortBy } from 'lodash';
import PropTypes from 'prop-types';

import useActivityScoreTotalStyles from './ActivityScoreTotal.style';

import { prefixPN } from '@scores/helpers';
import { useScores } from '@scores/requests/hooks/queries';
import useMyScoresStore from '@scores/stores/myScoresStore';

export default function ActivityScoreTotal({ class: klass, period, activities, evaluationSystem }) {
  const setFinalScore = useMyScoresStore((state) => state.setFinalScore);

  const [t] = useTranslateLoader(prefixPN('myScores'));
  const hasNonEvaluatedActivities = activities.some(
    (activity) =>
      activity.instance.gradable &&
      isNil(activity.mainGrade) &&
      activity.instance.metadata?.evaluationType !== 'auto'
  );

  const student = activities[0]?.user;

  const { data: customScore } = useScores({
    students: [student],
    classes: [klass.id],
    periods: [period?.period?.id],
    published: true,
  });

  const minGrade = sortBy(evaluationSystem.scales, 'number')?.[0]?.number;

  const weightedScore = hasNonEvaluatedActivities
    ? null
    : customScore?.[0]?.grade ??
      activities.reduce(
        (acc, activity) => acc + (activity.mainGrade ?? minGrade) * (activity.weight ?? 0),
        0
      );
  const nearestScale = getNearestScale({ grade: weightedScore, evaluationSystem });

  let color = 'tertiary';
  if (!hasNonEvaluatedActivities && nearestScale) {
    color = weightedScore < evaluationSystem.minScaleToPromote.number ? 'error' : 'success';
  }

  useEffect(() => {
    setFinalScore(klass.id, {
      grade: weightedScore,
      letter: nearestScale?.letter,
      student,
    });
  }, [weightedScore, nearestScale, setFinalScore, klass.id, student]);

  const { classes, cx } = useActivityScoreTotalStyles();

  return (
    <Stack justifyContent="space-between" alignItems="center" className={classes.root}>
      <Stack direction="column" className={classes.section}>
        <Text transform="uppercase" className={classes.finalGrade}>
          {t('finalGrades')}
        </Text>
        <Text className={classes.scaleDescription}>
          {hasNonEvaluatedActivities ? '-' : nearestScale?.description ?? '-'}
        </Text>
      </Stack>
      <Stack className={cx(classes.section, classes.rightSection)} justifyContent="center">
        <Text className={classes.score} color={color}>
          {weightedScore !== null
            ? nearestScale?.letter ?? parseFloat(weightedScore.toFixed(2))
            : '-'}
        </Text>
      </Stack>
    </Stack>
  );
}

ActivityScoreTotal.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      instance: PropTypes.shape({
        gradable: PropTypes.bool,
        assignable: PropTypes.shape({
          asset: PropTypes.shape({
            name: PropTypes.string,
          }),
        }),
      }),
      mainGrade: PropTypes.number,
      weight: PropTypes.number,
      hasNoWeight: PropTypes.bool,
      user: PropTypes.string,
    })
  ).isRequired,
  evaluationSystem: PropTypes.object.isRequired,
  class: PropTypes.object.isRequired,
  period: PropTypes.object.isRequired,
};
