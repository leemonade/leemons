import React from 'react';
import { ContextContainer, Stack, Button, Paragraph, Text } from '@bubbles-ui/components';

export default function DeliveryStep() {
  return (
    <ContextContainer title="Delivery">
      <Paragraph>DELIVERY</Paragraph>

      <Stack>
        {/* Space in html */}
        <Text strong>Hola &nbsp;</Text>
        <Text>Adios</Text>
      </Stack>
    </ContextContainer>
  );
}
