import React from 'react';
import { Box, Button } from '@bubbles-ui/components';
import { saveFeedbackRequest } from '@feedback/request';

export default function Detail() {
  async function test() {
    console.log('Hola?');
    try {
      const response = await saveFeedbackRequest({
        gtitos: 'molan',
      });

      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Box>
      <Button onClick={test}>Test</Button>
    </Box>
  );
}
