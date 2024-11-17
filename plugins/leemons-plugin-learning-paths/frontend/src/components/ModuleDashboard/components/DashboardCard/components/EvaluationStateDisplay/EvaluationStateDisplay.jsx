import useAssignationProgress from '@assignables/hooks/useAssignationProgress';
import { STATUS_NAMES } from '@assignables/hooks/useAssignationProgress/constants';
import { Box, Text } from '@bubbles-ui/components';
import { ClockIcon } from '@bubbles-ui/icons/solid';

import { EVALUATION_STATE_DISPLAY_PROP_TYPES } from './EvaluationStateDisplay.constants';
import { useEvaluationStateDisplayStyles } from './EvaluationStateDisplay.styles';
import { DeliveredIcon } from './icons/DeliveredIcon';
import { EvaluatedIcon } from './icons/EvaluatedIcon';

const EvaluationStateDisplay = ({ assignation }) => {
  const { statusName, label, color, hexColor } = useAssignationProgress({ assignation });

  const isEvaluated = statusName === STATUS_NAMES.evaluated;
  const isSubmitted =
    statusName === STATUS_NAMES.evaluableSubmitted ||
    statusName === STATUS_NAMES.nonEvaluableSubmitted;
  const notSumitted = statusName === STATUS_NAMES.notSubmitted;

  const { classes } = useEvaluationStateDisplayStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <Box className={classes.icon}>
          {isEvaluated && <EvaluatedIcon color={hexColor} />}
          {isSubmitted && <DeliveredIcon color={hexColor} />}
          {notSumitted && <ClockIcon color={hexColor} />}
        </Box>
        <Text color={color} className={classes.text}>
          {label}
        </Text>
      </Box>
    </Box>
  );
};

EvaluationStateDisplay.propTypes = EVALUATION_STATE_DISPLAY_PROP_TYPES;
EvaluationStateDisplay.displayName = 'EvaluationStateDisplay';

export default EvaluationStateDisplay;
export { EvaluationStateDisplay };
