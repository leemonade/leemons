import React, { useState } from 'react';
import { Box, Checkbox } from '@bubbles-ui/components';

export default function ConditionalInput({
  showOnTrue = true,
  render,
  helpPosition = 'bottom',
  ...props
}) {
  const [show, setShow] = useState(false);

  return (
    <Box>
      <Checkbox {...props} helpPosition={helpPosition} value={show} onChange={setShow} />
      {showOnTrue === show && render()}
    </Box>
  );
}
