import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Button, Stack, Paragraph, HtmlText } from '@bubbles-ui/components';

import { useApi } from '@common';
import getTaskRequest from '../../../../request/task/getTask';

export default function FeedbackStep({ id, onNext, onPrevious }) {
  const options = useMemo(
    () => ({
      id,
      columns: JSON.stringify(['feedback']),
    }),
    [id]
  );

  const [task] = useApi(getTaskRequest, options);

  return (
    <ContextContainer>
      <ContextContainer title="¿Qué has aprendido en este ejercicio?">
        <HtmlText>{task?.feedback?.description}</HtmlText>
        {task?.feedback?.mandatory && (
          <Paragraph>Recuerda: este feedback es obligatorio para completar el ejercicio</Paragraph>
        )}
        <Paragraph>Pintar aquí el formulario: {task?.feedback?.id}</Paragraph>
      </ContextContainer>
      <Stack fullWidth justifyContent="space-between">
        <Button onClick={onPrevious}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </Stack>
    </ContextContainer>
  );
}

FeedbackStep.propTypes = {
  id: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};
