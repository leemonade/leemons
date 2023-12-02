import React from 'react';
import { Box } from '@bubbles-ui/components';
import { EvaluationCardRightElementStyles } from './EvaluationCardRightElement.styles';

const EvaluationCardRightElement = () => {
  const { classes } = EvaluationCardRightElementStyles();
  return <Box className={classes.root}>EvaluationCardRightElement</Box>
}

export default EvaluationCardRightElement;
export { EvaluationCardRightElement };