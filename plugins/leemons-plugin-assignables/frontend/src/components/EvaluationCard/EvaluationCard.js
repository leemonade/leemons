import { Box } from '@bubbles-ui/components';
import React from 'react';
import { EvaluationCardBody } from './EvaluationCardBody/EvaluationCardBody';
import { EvaluationCardStyles } from './EvaluationCard.styles';
import { EvaluationCardFooter } from './EvaluationCardFooter';
import { EvaluationCardRightElement } from './EvaluationCardRightElement';
import {
  EVALUATIONCARD_DEFAULT_PROPS,
  EVALUATIONCARD_PROP_TYPES,
} from './EvaluationCard.constants';

const EvaluationCard = ({ instance, variantTitle, variantIcon, localizations }) => {
  const { color } = instance.asset;
  const { classes } = EvaluationCardStyles({ color });
  return (
    <Box className={classes.root}>
      <Box className={classes.wrapper}>
        <Box className={classes.color} />
        <Box style={{ width: '100%' }}>
          <EvaluationCardBody instance={instance} localizations={localizations} />
        </Box>
        <EvaluationCardFooter {...instance} variantTitle={variantTitle} variantIcon={variantIcon} />
      </Box>
      <Box>
        <EvaluationCardRightElement instance={instance} localizations={localizations} />
      </Box>
    </Box>
  );
};

EvaluationCard.propTypes = EVALUATIONCARD_PROP_TYPES;
EvaluationCard.defaultProps = EVALUATIONCARD_DEFAULT_PROPS;
EvaluationCard.displayName = 'EvaluationCard';

export default EvaluationCard;
export { EvaluationCard };
