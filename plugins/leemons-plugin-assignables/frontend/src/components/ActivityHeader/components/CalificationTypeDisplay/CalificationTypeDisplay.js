import React from 'react';
import PropTypes from 'prop-types';
import {
  useEvaluationType,
  useEvaluationTypeLocalizations,
} from '@assignables/hooks/useEvaluationType';
import getEvaluationTypesIcons from '@assignables/helpers/getEvaluationTypesIcons';
import { Box, Text } from '@bubbles-ui/components';
import useCalificationTypeDisplay from './CalificationTypeDisplay.style';

export default function CalificationTypeDisplay({ assignable, hidden }) {
  const localizations = useEvaluationTypeLocalizations();
  const evaluationType = useEvaluationType(assignable ?? {});
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
  assignable: PropTypes.object,
  hidden: PropTypes.bool,
};
