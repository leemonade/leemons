import React from 'react';
import { ContextContainer, Paragraph, Button, Box, Stack } from '@bubbles-ui/components';

export default function StatementAndDevelopmentStep({ onNext, onPrevious }) {
  return (
    <ContextContainer>
      <ContextContainer title="Statement">
        <Paragraph>STATEMENT</Paragraph>
      </ContextContainer>
      <ContextContainer title="Development">
        <Paragraph>DEVELOPMENT</Paragraph>
      </ContextContainer>
      <Stack fullWidth justifyContent="space-between">
        <Button onClick={onPrevious}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </Stack>
    </ContextContainer>
  );
}
