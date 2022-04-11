import React from 'react';
import PropTypes from 'prop-types';
import {
  ContextContainer,
  Button,
  Stack,
  Paragraph,
  HtmlText,
  Textarea,
  useDebouncedValue,
} from '@bubbles-ui/components';
import useTask from '../helpers/useTask';
import useDeliverable from '../helpers/useDelivery';
import addDeliverableRequest from '../../../../request/instance/addDeliverable';

function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export default function SelfReflectionStep({ id, instance, student, onNext, onPrevious }) {
  const task = useTask(id, ['selfReflection']);
  const submittedSelfReflection = useDeliverable(instance, student, 'selfReflection');

  const [selfReflection, setSelfReflection] = React.useState(submittedSelfReflection || {});

  const [debouncedSelfReflection] = useDebouncedValue(selfReflection, 500);

  React.useEffect(() => {
    if (submittedSelfReflection !== selfReflection) {
      setSelfReflection(submittedSelfReflection);
    }
  }, [submittedSelfReflection]);

  React.useEffect(() => {
    if (debouncedSelfReflection?.length) {
      addDeliverableRequest({
        instance,
        user: student,
        type: 'selfReflection',
        deliverable: debouncedSelfReflection,
      });
    }
  }, [debouncedSelfReflection]);

  const options = React.useMemo(
    () => isJSON(task?.selfReflection?.id) && JSON.parse(task?.selfReflection?.id),
    [task?.selfReflection]
  );

  return (
    <ContextContainer>
      <ContextContainer title={options?.title || '¿Qué has aprendido en este ejercicio?'}>
        <HtmlText>{task?.selfReflection?.description}</HtmlText>
        {task?.selfReflection?.mandatory && (
          <Paragraph>Recuerda: esta reflexión es obligatoria para completar el ejercicio</Paragraph>
        )}
        {options ? (
          <Textarea
            minRows={4}
            maxLength={options?.maxWords}
            counter="word"
            label="Self Reflection"
            value={selfReflection}
            onChange={setSelfReflection}
          />
        ) : (
          <Paragraph>Pintar aquí el formulario: {task?.selfReflection?.id}</Paragraph>
        )}
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
