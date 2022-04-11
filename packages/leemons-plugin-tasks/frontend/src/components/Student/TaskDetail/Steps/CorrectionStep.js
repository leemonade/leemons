import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Box, Text, UserDisplayItem, HtmlText } from '@bubbles-ui/components';
import { Grade } from '../../../Grade';
import useProgram from '../helpers/useProgram';

export default function CorrectionStep({ program: programId, correction }) {
  const program = useProgram(programId);
  return (
    <ContextContainer title="Calificación">
      <ContextContainer direction="row">
        <Box>
          <Grade evaluation={program?.evaluationSystem} value={correction?.grade} />
        </Box>
        <Box>
          <Text>Comentarios</Text>
          <HtmlText>{correction?.teacherFeedback}</HtmlText>
        </Box>
      </ContextContainer>
      <ContextContainer justifyContent="center">
        {/* <Box>
          <Text>¿Quieres hacer alguna consulta sobre esta evaluación?</Text>
          <UserDisplayItem />
        </Box> */}
      </ContextContainer>
    </ContextContainer>
  );
}

CorrectionStep.propTypes = {
  program: PropTypes.string,
  correction: PropTypes.shape({
    grade: PropTypes.string,
    teacherFeedback: PropTypes.string,
  }),
};
