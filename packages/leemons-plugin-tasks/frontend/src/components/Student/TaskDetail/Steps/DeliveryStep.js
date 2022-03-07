import React from 'react';
import PropTypes from 'prop-types';
import {
  ContextContainer,
  Stack,
  Button,
  Paragraph,
  Text,
  Alert,
  Paper,
} from '@bubbles-ui/components';

function TaggedText({ tag, text }) {
  return (
    <Stack>
      <Text strong>{tag}:&nbsp;</Text>
      <Text>{text}</Text>
    </Stack>
  );
}

export default function DeliveryStep({ onNext, onPrevious }) {
  return (
    <ContextContainer title="Delivery">
      <Paragraph>DELIVERY</Paragraph>

      <TaggedText tag="Tipo de archivo" text="CONFIG DE ARCHIVOS" />
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
};
