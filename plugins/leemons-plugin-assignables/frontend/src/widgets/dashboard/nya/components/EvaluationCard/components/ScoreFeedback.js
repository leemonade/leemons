import React, { useMemo, useState, useEffect } from 'react';
import { Box, Text, Badge } from '@bubbles-ui/components';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import _, { cloneDeep, sortBy } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { useScoreFeedbackStyles } from './ScoreFeedback.styles';
import { getActivityType } from '../../../../../../helpers/getActivityType';
import prefixPN from '../../../../../../helpers/prefixPN';
import { ArrowComponent } from './ArrowComponent/ArrowComponent';

export function findNearestFloorScore(score, scales) {
  const sortedScales = sortBy(cloneDeep(scales), 'number');
  let nearestScore = null;
  let distance = Infinity;
  const { length } = sortedScales;

  for (let i = 0; i < length; i++) {
    const scale = sortedScales[i];

    if (score === scale.number) {
      return scale;
    }

    const currentDistance = Math.abs(scale.number - score);

    if (currentDistance < distance) {
      nearestScore = scale;
      distance = currentDistance;
    } else {
      break;
    }
  }
  return nearestScore;
}

export default function ScoreFeedback({ score, program, instance }) {
  const evaluationSystem = useProgramEvaluationSystem(program);
  const { minScaleToPromote, scales, type } = evaluationSystem || {};
  const [, translations] = useTranslateLoader(prefixPN('assignmentForm'));
  const localizations = useMemo(() => {
    const res = unflatten(translations?.items);
    return {
      assignmentForm: _.get(res, prefixPN('assignmentForm')),
    };
  }, [translations]);
  const [calificationType, setCalificationType] = useState(null);
  const getInstanceTypeLocale = (instanceParam) => {
    const activityType = getActivityType(instanceParam);
    const localizationType = localizations?.assignmentForm?.evaluation?.typeInput?.options;
    const activityTypeLocale = {
      calificable: localizationType?.calificable,
      puntuable: localizationType?.punctuable,
      no_evaluable: localizationType?.nonEvaluable,
    };
    setCalificationType(activityTypeLocale[activityType]);
  };

  const color = React.useMemo(() => {
    const minScale = minScaleToPromote?.number;
    if (score < minScale) {
      return 'error';
    }
    if (score === minScale) {
      return 'warning';
    }
    return 'success';
  });
  const isLetterType = type === 'letter';

  const grade = React.useMemo(() => {
    if (isLetterType) {
      return {
        letter: findNearestFloorScore(Number(score), scales).letter,
        description: findNearestFloorScore(Number(score), scales).description,
      };
    }
    const isInteger = score % 1 === 0;
    const integerPart = !isInteger && score.toFixed(2).split('.')[0];
    const decimalsPart = !isInteger && score.toFixed(2).split('.')[1];
    if (isInteger) {
      return {
        integer: score,
        decimals: null,
        description: findNearestFloorScore(Number(score), scales)?.description,
      };
    }
    return {
      integer: integerPart,
      decimals: decimalsPart,
      description: findNearestFloorScore(Number(score), scales)?.description,
    };
  }, [scales, type, score]);

  useEffect(() => {
    getInstanceTypeLocale(instance);
  }, [instance, calificationType, setCalificationType]);

  const { classes } = useScoreFeedbackStyles({ color });
  return (
    <Box className={classes.root}>
      {calificationType && (
        <Badge closable={false} size="xs" className={classes.calificationBadge}>
          <Text className={classes.badgeText}>{calificationType?.toUpperCase()}</Text>
        </Badge>
      )}
      {!!score && (
        <>
          <Box className={classes.containerGrade}>
            <Box className={classes.containerNumber}>
              <Text className={classes.gradeNumber}>
                {isLetterType ? grade.letter : grade.integer}
              </Text>
              {grade.decimals && (
                <Text className={classes.gradeDecimals}>{`.${grade.decimals}`}</Text>
              )}
              <Box className={classes.containerArrow}>
                <ArrowComponent state={'better'} />
              </Box>
            </Box>
            <Text className={classes.descriptionGrade}>{grade?.description?.toUpperCase()}</Text>
          </Box>
        </>
      )}
    </Box>
  );
}
