import React from 'react';
import { ContextContainer, Box, Text, UserDisplayItem } from '@bubbles-ui/components';

export default function CorrectionStep() {
  return (
    <ContextContainer title="Calificación">
      <ContextContainer direction="row">
        <Box>
          <Text>9</Text>
        </Box>
        <Box>
          <Text>Comentarios</Text>
          <Text>Comentario</Text>
        </Box>
      </ContextContainer>
      <ContextContainer justifyContent="center">
        <Box>
          <Text>¿Quieres hacer alguna consulta sobre esta evaluación?</Text>
          <UserDisplayItem />
        </Box>
      </ContextContainer>
    </ContextContainer>
  );
}
