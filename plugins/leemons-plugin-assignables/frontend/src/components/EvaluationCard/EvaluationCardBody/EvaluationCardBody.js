import React from 'react';
import { Box, TextClamp, Text } from '@bubbles-ui/components';
import { ClassroomItemDisplay } from '@academic-portfolio/components';
import { EvaluationCardBodyStyles } from './EvaluationCardBody.styles';
import {
  EVALUATIONCARD_BODY_DEFAULT_PROPS,
  EVALUATIONCARD_BODY_PROP_TYPES,
} from './EvaluationCardBody.constants';

const EvaluationCardBody = ({ instance, localizations }) => {
  const { classes } = EvaluationCardBodyStyles();
  const { name } = instance.asset;
  const { deadline } = instance.deadlineProps;
  const deadlineFormatted = deadline
    ? new Date(deadline).toLocaleDateString()
    : localizations?.deadline?.noDeadline;
  return (
    <Box className={classes.root}>
      <Box>
        <TextClamp lines={2}>
          <Text className={classes.title}>{name}</Text>
        </TextClamp>
      </Box>
      <Box className={classes.classroomContainer}>
        <ClassroomItemDisplay classroomIds={instance?.classes} showSubject={true} />
      </Box>
      <Text className={classes.deadline}>{deadlineFormatted}</Text>
    </Box>
  );
};

EvaluationCardBody.propTypes = EVALUATIONCARD_BODY_PROP_TYPES;
EvaluationCardBody.defaultProps = EVALUATIONCARD_BODY_DEFAULT_PROPS;
EvaluationCardBody.displayName = 'EvaluationCardBody';

export default EvaluationCardBody;
export { EvaluationCardBody };
