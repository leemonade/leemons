import { Stack, Text } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import getNearestScale from '@scorm/helpers/getNearestScale';
import { useUserAgents } from '@users/hooks';

import useActivityScoreTotalStyles from '@scores/components/MyScores/components/SubjectsScoreList/components/SubjectScoreColumn/components/ActivityScoreTotal/ActivityScoreTotal.style';
import { prefixPN } from '@scores/helpers';
import { useScores } from '@scores/requests/hooks/queries';

interface Props {
  evaluationSystem: {
    minScaleToPromote: {
      number: number;
    };
  };
  classId: string;
}

export function FinalScoreTotal({ evaluationSystem, classId }: Props) {
  const [t] = useTranslateLoader(prefixPN('myScores'));

  const { classes, cx } = useActivityScoreTotalStyles();

  const student = useUserAgents();
  const { data: scores } = useScores({
    students: student,
    classes: [classId],
    periods: ['final'],
    published: true,
  });

  const score = scores?.[0]?.grade ?? null;
  const nearestScale = score === null ? null : getNearestScale({ grade: score, evaluationSystem });

  let color = 'tertiary';
  if (nearestScale) {
    color = score < evaluationSystem.minScaleToPromote.number ? 'error' : 'success';
  }

  return (
    <Stack justifyContent="space-between" alignItems="center" className={classes.root}>
      <Stack direction="column" className={classes.section}>
        <Text transform="uppercase" className={classes.finalGrade}>
          {t('finalGrades')}
        </Text>
        <Text className={classes.scaleDescription}>{nearestScale?.description ?? '-'}</Text>
      </Stack>
      <Stack
        className={cx(classes.section, classes.rightSection)}
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Text className={classes.score} color={color}>
          {score !== null ? nearestScale?.letter ?? parseFloat(score.toFixed(2)) : '-'}
        </Text>
      </Stack>
    </Stack>
  );
}
