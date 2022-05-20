import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Alert, Paper, Stack, Text } from '@bubbles-ui/components';

function TaggedText({ tag, text }) {
  return (
    <Stack>
      <Text strong>{tag}:&nbsp;</Text>
      <Text>{text}</Text>
    </Stack>
  );
}

TaggedText.propTypes = {
  tag: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default function File({ submission }) {
  return (
    <>
      <TaggedText
        tag="Tipo de archivo"
        text={`${
          submission.data?.multipleFiles ? 'Multiple files of: ' : 'One file of: '
        }${submission.data?.extensions?.join(', ')} con un peso máximo de ${
          submission.data?.maxSize
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
    </>
  );
}

File.propTypes = {
  submission: PropTypes.shape({
    data: PropTypes.shape({
      multipleFiles: PropTypes.bool,
      extensions: PropTypes.arrayOf(PropTypes.string),
      maxSize: PropTypes.number,
    }),
  }).isRequired,
};
