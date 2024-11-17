import React, { useMemo, useState, useEffect } from 'react';

import { Box, Text, Badge, TextClamp } from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import _, { cloneDeep, sortBy, isNil } from 'lodash';

import { getActivityType } from '../../../../../../helpers/getActivityType';
import prefixPN from '../../../../../../helpers/prefixPN';

import { GotFeedbackIcon } from './GotFeedbackIcon';
import { SCOREFEEDBACK_DEFAULT_PROPS, SCOREFEEDBACK_PROP_TYPES } from './ScoreFeedback.constants';
import { useScoreFeedbackStyles } from './ScoreFeedback.styles';

import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';

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

export default function ScoreFeedback({
  score,
  program,
  instance,
  isFeedback,
  hideBadge,
  fullSize,
}) {
  let arrowPosition = 'equal';

  if (/([0,3,6]|[a,d])$/.test(instance.id)) {
    arrowPosition = 'equal';
  } else if (/([1,4,7,9]|[b,e])$/.test(instance.id)) {
    arrowPosition = 'better';
  } else if (/([2,5,8]|[c,f])$/.test(instance.id)) {
    arrowPosition = 'bad';
  }
  const evaluationSystem = useProgramEvaluationSystem(program);
  const { minScaleToPromote, scales, type } = evaluationSystem || {};
  const [, translations] = useTranslateLoader([prefixPN('assignmentForm'), prefixPN('ongoing')]);
  const localizations = useMemo(() => {
    const res = unflatten(translations?.items);
    return {
      assignmentForm: _.get(res, prefixPN('assignmentForm')),
      ongoing: _.get(res, prefixPN('ongoing')),
    };
  }, [translations]);
  const [calificationType, setCalificationType] = useState(null);
  const localizationType = localizations?.assignmentForm?.evaluation?.typeInput?.options;
  const getInstanceTypeLocale = (instanceParam) => {
    const activityType = getActivityType(instanceParam);
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
        letter: findNearestFloorScore(Number(score), scales)?.letter,
        description: findNearestFloorScore(Number(score), scales)?.description,
      };
    }
    const isInteger = score % 1 === 0;
    const integerPart = !isInteger && !isNil(score) && score.toFixed(2).split('.')[0];
    const decimalsPart = !isInteger && !isNil(score) && score.toFixed(2).split('.')[1];
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
  const { classes } = useScoreFeedbackStyles({ color, fullSize });
  return (
    <Box className={classes.root}>
      {!!calificationType && !hideBadge && !isNil(score) && (
        <Badge closable={false} size="xs" className={classes.calificationBadge} disableHover>
          <Text className={classes.badgeText}>{calificationType?.toUpperCase()}</Text>
        </Badge>
      )}
      {!isNil(score) && !isFeedback ? (
        <Box className={classes.containerGrade}>
          <Box className={classes.containerNumber}>
            <Text className={classes.gradeNumber}>
              {isLetterType ? grade.letter : grade.integer}
            </Text>
            {!isNil(grade.decimals) && (
              <TextClamp lines={2}>
                <Text className={classes.gradeDecimals}>{`.${grade.decimals}`}</Text>
              </TextClamp>
            )}
            {/* <Box className={classes.containerArrow}>
                <ArrowComponent state={arrowPosition} />
              </Box> */}
          </Box>
          <Text className={classes.descriptionGrade}>{grade?.description?.toUpperCase()}</Text>
        </Box>
      ) : (
        <>
          {!isNil(score) && (
            <Badge disableHover closable={false} size="xs" className={classes.calificationBadge}>
              <Text className={classes.badgeText}>{localizationType?.feedback?.toUpperCase()}</Text>
            </Badge>
          )}
          <Box className={classes.containerGrade} style={{ marginTop: 0 }}>
            <Box className={classes.containerFeedback}>
              {!isNil(score) ? (
                <>
                  <GotFeedbackIcon />
                  <Text className={classes.textFeedback}>
                    {localizationType?.feedbackAvailable}
                  </Text>
                </>
              ) : (
                <Text strong size="xl">
                  {'-'}
                </Text>
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

ScoreFeedback.propTypes = SCOREFEEDBACK_PROP_TYPES;
ScoreFeedback.defaultProps = SCOREFEEDBACK_DEFAULT_PROPS;
