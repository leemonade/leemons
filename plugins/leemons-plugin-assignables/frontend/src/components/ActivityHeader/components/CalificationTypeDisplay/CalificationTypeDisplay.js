import React from 'react';
import PropTypes from 'prop-types';
import {
  useEvaluationType,
  useEvaluationTypeLocalizations,
} from '@assignables/hooks/useEvaluationType';
import getEvaluationTypesIcons from '@assignables/helpers/getEvaluationTypesIcons';
import { Box, Text } from '@bubbles-ui/components';
import { useCalificationTypeDisplay } from './CalificationTypeDisplay.style';

export default function CalificationTypeDisplay({ instance, hidden }) {
  const localizations = useEvaluationTypeLocalizations();
  const evaluationType = useEvaluationType(instance ?? {});
  const icons = getEvaluationTypesIcons();
  const Icon = icons[evaluationType];

  const { classes } = useCalificationTypeDisplay();

  if (hidden) {
    return null;
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.icon}>
        <Icon width={18} height={18} />
      </Box>
      <Box className={classes.text}>
        <Text>{localizations?.[evaluationType]}</Text>
      </Box>
    </Box>
  );
}

CalificationTypeDisplay.propTypes = {
  instance: PropTypes.object,
  hidden: PropTypes.bool,
};
