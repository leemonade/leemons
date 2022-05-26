import React from 'react';
import { Box, ContextContainer } from '@bubbles-ui/components';

export default function Sidebar({ assignation, show = true, className, labels }) {
  if (show) {
    return (
      <Box className={className}>
        <p>Esta barra permanecerá oculta cuando no exista ni equipo ni recursos.</p>
        <p>Está visible para que veais cuando se vería</p>
        <p>Cada sección tan solo se mostrará si existe contenido para la misma</p>
        <ContextContainer title={labels?.resources}></ContextContainer>
        <ContextContainer title={labels?.team}></ContextContainer>
      </Box>
    );
  }
  return null;
}
