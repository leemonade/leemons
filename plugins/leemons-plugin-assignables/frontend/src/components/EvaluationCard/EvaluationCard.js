import { Box } from '@bubbles-ui/components';
import React from 'react';
import { EvaluationCardBody } from './EvaluationCardBody/EvaluationCardBody';
import { EvaluationCardStyles } from './EvaluationCard.styles';
import { EvaluationCardFooter } from './EvaluationCardFooter';
import { EvaluationCardRightElement } from './EvaluationCardRightElement';

const EvaluationCard = ({ instance, variantTitle, variantIcon, localizations, isHovered }) => {
  const { color } = instance?.asset;
  const { classes } = EvaluationCardStyles({ color, isHovered });

  return (
    <Box className={classes.root}>
      <Box className={classes.wrapper}>
        <Box className={classes.color} />
        <Box>
          <EvaluationCardBody instance={instance} localizations={localizations} />
        </Box>
        <EvaluationCardFooter {...instance} variantTitle={variantTitle} variantIcon={variantIcon} />
      </Box>
      <Box>
        <EvaluationCardRightElement />
      </Box>
    </Box>
  );
};

export default EvaluationCard;
export { EvaluationCard };
