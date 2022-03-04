import React from 'react';
import { ContextContainer, Button } from '@bubbles-ui/components';

export default function PreTask({ onNext }) {
  return (
    <ContextContainer title="Pretask">
      <p>Aquí iría la info del Pretask</p>
      <Button onClick={onNext}>Next</Button>
    </ContextContainer>
  );
}
