import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Button, Stack, Paragraph, HtmlText } from '@bubbles-ui/components';

import { useApi } from '@common';
import getTaskRequest from '../../../../request/task/getTask';
import useTask from '../helpers/useTask';

export default function SelfReflectionStep({ id, onNext, onPrevious }) {
  const task = useTask(id, ['selfReflection']);
  return (
    <ContextContainer>
      <ContextContainer title="¿Qué has aprendido en este ejercicio?">
        <HtmlText>{task?.selfReflection?.description}</HtmlText>
        {task?.selfReflection?.mandatory && (
          <Paragraph>Recuerda: esta reflexión es obligatoria para completar el ejercicio</Paragraph>
        )}
        <Paragraph>Pintar aquí el formulario: {task?.selfReflection?.id}</Paragraph>
      </ContextContainer>
      <Stack fullWidth justifyContent="space-between">
        <Button onClick={onPrevious}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </Stack>
    </ContextContainer>
  );
}

SelfReflectionStep.propTypes = {
  id: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};
