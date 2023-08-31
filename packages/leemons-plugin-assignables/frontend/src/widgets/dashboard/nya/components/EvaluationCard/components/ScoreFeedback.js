import React from 'react';
import { Box, createStyles, ImageLoader, Text } from '@bubbles-ui/components';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import { RatingStarIcon } from '@bubbles-ui/icons/solid';
import { useRoomsMessageCount } from '@comunica/components';
import { cloneDeep, sortBy } from 'lodash';
import CommentIcon from './CommentIcon.svg';

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

const useScoreFeedbackStyles = createStyles((theme, { color: _c }) => {
  let color;
  switch (_c) {
    case 'error':
      color = theme.other.global.content.color.negative;
      break;
    case 'warning':
      color = theme.other.global.content.color.attention;
      break;
    case 'success':
      color = theme.other.global.content.color.positive;
      break;
    default:
      color = undefined;
  }

  return {
    root: {
      height: 198,
      display: 'flex',
      flexDirection: 'column',
      borderTopRightRadius: theme.other.global.border.radius.md,
      borderBottomRightRadius: theme.other.global.border.radius.md,
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: 142,
      position: 'relative',
    },
    score: {
      gap: theme.spacing[2],
      background: color?.emphasis,
      flex: '1 0',
    },
    text: {
      color: theme.other.score.background.color.neutral.subtle,
      ...theme.other.score.content.typo['2xlg'],
    },
    feedback: {
      flex: '1 0',
      background: color?.default,
    },
    icon: {
      position: 'relative',
      height: 46,
      width: 51,
    },
    iconText: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      ...theme.other.score.content.typo['2xlg'],
    },
  };
});

export default function ScoreFeedback({ score, program, rooms, isCalificable }) {
  const evaluationSystem = useProgramEvaluationSystem(program);
  const { count } = useRoomsMessageCount(rooms);
  const { minScaleToPromote, scales, type } = evaluationSystem || {};

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

  const grade = React.useMemo(() => {
    if (type === 'letter') {
      return findNearestFloorScore(Number(score), scales).letter;
    }

    return score;
  }, [scales, type, score]);

  const { classes, cx } = useScoreFeedbackStyles({ color });
  return (
    <Box className={classes.root}>
      {!!score && (
        <Box className={cx(classes.container, classes.score, classes.text)}>
          {!!isCalificable && <RatingStarIcon />}
          <Text className={classes.text}>{grade}</Text>
        </Box>
      )}
      {!!rooms?.length && (
        <Box className={cx(classes.container, classes.feedback, classes.text)}>
          <Box className={classes.icon}>
            <ImageLoader src={CommentIcon} height="100%" />
          </Box>
          <Text className={classes.iconText}>{count > 99 ? '+99' : count}</Text>
        </Box>
      )}
    </Box>
  );
}
