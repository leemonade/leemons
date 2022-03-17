import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ContextContainer, Button, Stack, Paragraph, HtmlText } from '@bubbles-ui/components';

import { useApi } from '@common';
import getTaskRequest from '../../../../request/task/getTask';
import updateStudentRequest from '../../../../request/instance/updateStudent';

export default function FeedbackStep({ instance, student, id, onPrevious }) {
  const history = useHistory();

  const options = useMemo(
    () => ({
      id,
      columns: JSON.stringify(['feedback']),
    }),
    [id]
  );

  const onNext = () => {
    updateStudentRequest({
      instance,
      student,
      key: 'end',
      value: new Date().getTime(),
    });
    history.push(`/private/tasks/ongoing`);
  };

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
        <Button onClick={onNext}>Finish</Button>
      </Stack>
    </ContextContainer>
  );
}

FeedbackStep.propTypes = {
  instance: PropTypes.string.isRequired,
  student: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};
