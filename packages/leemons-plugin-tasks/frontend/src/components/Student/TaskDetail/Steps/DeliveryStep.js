import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ContextContainer,
  Stack,
  Button,
  Paragraph,
  Text,
  Alert,
  Paper,
  HtmlText,
} from '@bubbles-ui/components';

import { useApi } from '@common';
import getTaskRequest from '../../../../request/task/getTask';

function TaggedText({ tag, text }) {
  return (
    <Stack>
      <Text strong>{tag}:&nbsp;</Text>
      <Text>{text}</Text>
    </Stack>
  );
}

export default function DeliveryStep({ onNext, onPrevious, id }) {
  const options = useMemo(
    () => ({
      id,
      columns: JSON.stringify(['submissions']),
    }),
    [id]
  );
  const [task] = useApi(getTaskRequest, options);

  return (
    <ContextContainer title="Delivery">
      <HtmlText>{task?.submissions?.description}</HtmlText>

      <TaggedText
        tag="Tipo de archivo"
        text={`${
          task?.submissions?.data?.multipleFiles ? 'Multiple files of: ' : 'One file of: '
        }${task?.submissions?.data?.extensions?.join(', ')} con un peso máximo de ${
          task?.submissions?.data?.maxSize
        }Kb`}
      />
      <TaggedText tag="Evaluable" text="CONFIG DE EVALUACION" />
      <Alert title="Recuerda" severity="info" closeable={false}>
        una vez entregado el archivo podrás sustituirlo tantas veces como necesites hasta la fecha
        de expiración de la prueba pero solo se guardará la última versión
      </Alert>
      <Paper color="solid">
        <ContextContainer title="Your deliver">DELIVERIES</ContextContainer>
      </Paper>

      <Stack fullWidth justifyContent="space-between">
        <Button onClick={onPrevious}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </Stack>
    </ContextContainer>
  );
}

DeliveryStep.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
