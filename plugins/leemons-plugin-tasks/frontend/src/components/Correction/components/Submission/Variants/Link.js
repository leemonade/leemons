import React from 'react';
import { Anchor } from '@bubbles-ui/components';

export default function Link({ assignation }) {
  return (
    <Anchor href={assignation.metadata?.submission} target="_blank">
      {assignation.metadata?.submission}
    </Anchor>
  );
}
