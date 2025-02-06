import { useMemo } from 'react';

import { Stack, Text, TextClamp } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import getNearestScale from '@scorm/helpers/getNearestScale';

import useActivityScoreDisplayStyles from '@scores/components/MyScores/components/SubjectsScoreList/components/SubjectScoreColumn/components/ActivityScoreDisplay/ActivityScoreDisplay.styles';
import { prefixPN } from '@scores/helpers';
import { useRetakes } from '@scores/requests/hooks/queries/useRetakes';

interface Props {
  substage: {
    id: string;
    name: string;
    score: number;
    retake: string;
  };
  evaluationSystem: unknown;
  classId: string;
}

export function EvaluationScoreDisplay({ substage, evaluationSystem, classId }: Props) {
  const scale = getNearestScale({ grade: substage.score, evaluationSystem });

  const [t] = useTranslateLoader(prefixPN('myScores.evaluationRow'));

  const { data: retakes } = useRetakes({
    classId,
    period: substage.id,
    options: {
      enabled: !!substage.retake,
    },
  });

  const retake = useMemo(() => {
    if (!retakes) {
      return null;
    }

    return retakes.find((r) =>
      substage.retake === '0' ? r.index === 0 : r.id === substage.retake
    );
  }, [retakes, substage.retake]);

  const { classes } = useActivityScoreDisplayStyles();

  return (
    <Stack className={classes.root} justifyContent="space-between" alignItems="center" fullWidth>
      {/*
        === Left side ===
      */}
      <Stack direction="column" className={classes.leftSide}>
        {!!retake && retakes.length > 1 && (
          <Stack direction="row" spacing={1} alignItems="baseline">
            <Text transform="uppercase" className={classes.role}>
              {retake?.index === 0 && t('firstRetake')}
              {retake?.index === 1 && t('secondRetake')}
              {retake?.index > 1 && t('other', { retake: retake.index + 1 })}
            </Text>
          </Stack>
        )}
        <TextClamp lines={1}>
          <Text className={classes.activityName}>{substage?.name}</Text>
        </TextClamp>
      </Stack>

      {/*
        === Right side ===
      */}
      <Stack direction="column" spacing={1} className={classes.rightSide} alignItems="center">
        <Text className={classes.score}>
          {scale?.letter ?? parseFloat(scale?.number?.toFixed(2))}
        </Text>
      </Stack>
    </Stack>
  );
}
