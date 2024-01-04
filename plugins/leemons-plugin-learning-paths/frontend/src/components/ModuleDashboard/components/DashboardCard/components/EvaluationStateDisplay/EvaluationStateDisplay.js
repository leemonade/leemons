import React from 'react';
import { Box, Text } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@learning-paths/helpers/prefixPN';
import { useEvaluationStateDisplayStyles } from './EvaluationStateDisplay.styles';
import {
  EVALUATION_STATE_DISPLAY_DEFAULT_PROPS,
  EVALUATION_STATE_DISPLAY_PROP_TYPES,
} from './EvaluationStateDisplay.constants';
import { DeliveredIcon } from './icons/DeliveredIcon';
import { EvaluatedIcon } from './icons/EvaluatedIcon';

const EvaluationStateDisplay = ({ state }) => {
  const { classes } = useEvaluationStateDisplayStyles();
  const [t] = useTranslateLoader(prefixPN('gradeState'));
  const isEvaluated = state;
  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        {isEvaluated ? (
          <>
            <Box className={classes.icon}>
              <EvaluatedIcon />
            </Box>
            <Text className={classes.text}>{t('evaluated')}</Text>
          </>
        ) : (
          <>
            <Box className={classes.icon}>
              <DeliveredIcon />
            </Box>
            <Text className={classes.text}>{t('delivered')}</Text>
          </>
        )}
      </Box>
    </Box>
  );
};

EvaluationStateDisplay.propTypes = EVALUATION_STATE_DISPLAY_PROP_TYPES;
EvaluationStateDisplay.defaultProps = EVALUATION_STATE_DISPLAY_DEFAULT_PROPS;
EvaluationStateDisplay.displayName = 'EvaluationStateDisplay';

export default EvaluationStateDisplay;
export { EvaluationStateDisplay };
