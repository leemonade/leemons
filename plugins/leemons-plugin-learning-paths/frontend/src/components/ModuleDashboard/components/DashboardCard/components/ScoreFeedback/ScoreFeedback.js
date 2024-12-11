import React, { useMemo, useState } from 'react';

import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import { Box, Text, Badge, TextClamp } from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import _, { isNil, sortBy } from 'lodash';

import prefixPN from '../../../../../../helpers/prefixPN';

import { GotFeedbackIcon } from './GotFeedbackIcon';
import { SCOREFEEDBACK_DEFAULT_PROPS, SCOREFEEDBACK_PROP_TYPES } from './ScoreFeedback.constants';
import { useScoreFeedbackStyles } from './ScoreFeedback.styles';

export function findNearestFloorScore(score, scales) {
  const sortedScales = sortBy(scales, 'number');
  let nearestScore = null;
  let distance = Infinity;
  const { length } = sortedScales;

  for (let i = 0; i < length; i++) {
    const scale = sortedScales[i];

    if (score === scale.number) {
      return scale;
    }

    const currentDistance = Math.abs(scale.number - score);

    if (currentDistance <= distance) {
      nearestScore = scale;
      distance = currentDistance;
    } else {
      break;
    }
  }
  return nearestScore;
}

const ScoreFeedback = ({ score, program, instance, isFeedback }) => {
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
  const isLetterType = type === 'letter';

  const [calificationType, setCalificationType] = useState(null);
  const localizationType = localizations?.assignmentForm?.evaluation?.typeInput?.options;

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

  const { classes } = useScoreFeedbackStyles();

  return (
    <Box className={classes.root}>
      {calificationType && (
        <Badge closable={false} size="xs" className={classes.calificationBadge}>
          <Text className={classes.badgeText}>{calificationType?.toUpperCase()}</Text>
        </Badge>
      )}
      {!isNil(score) && !isFeedback ? (
        <>
          <Box className={classes.containerGrade}>
            <Box className={classes.containerNumber}>
              <Text className={classes.gradeNumber}>
                {isLetterType ? grade.letter : grade.integer}
              </Text>
              {grade.decimals && (
                <TextClamp lines={2}>
                  <Text className={classes.gradeDecimals}>{`.${grade.decimals}`}</Text>
                </TextClamp>
              )}
              {/* <Box className={classes.containerArrow}>
                <ArrowComponent state={'better'} />
              </Box> */}
            </Box>
            <Text className={classes.descriptionGrade}>{grade?.description?.toUpperCase()}</Text>
          </Box>
        </>
      ) : (
        <>
          <Badge closable={false} size="xs" className={classes.calificationBadge}>
            <Text className={classes.badgeText}>{localizationType?.feedback?.toUpperCase()}</Text>
          </Badge>
          <Box className={classes.containerGrade} style={{ marginTop: 0 }}>
            <Box className={classes.containerFeedback}>
              <GotFeedbackIcon />
              <Text className={classes.textFeedback}>{localizationType?.feedbackAvailable}</Text>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

ScoreFeedback.propTypes = SCOREFEEDBACK_PROP_TYPES;
ScoreFeedback.defaultProps = SCOREFEEDBACK_DEFAULT_PROPS;

export default ScoreFeedback;
export { ScoreFeedback };
