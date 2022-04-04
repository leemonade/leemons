import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ContextContainer, Button, Stack, Paragraph, HtmlText } from '@bubbles-ui/components';

import updateStudentRequest from '../../../../request/instance/updateStudent';
import useTask from '../helpers/useTask';

export default function FeedbackStep({ instance, student, id, onPrevious, onNext }) {
  const history = useHistory();
  const task = useTask(id, ['feedback']);

  const updateStudent = () =>
    updateStudentRequest({
      instance,
      student,
      key: 'end',
      value: new Date().getTime(),
    });

  const onFinish = async () => {
    await updateStudent();
    history.push(`/private/tasks/ongoing`);
  };

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
        <Button onClick={onFinish}>Finish</Button>
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
