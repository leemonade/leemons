import React from 'react';


import { Stack } from '@bubbles-ui/components';

import HideFromCalendar from '../HideFromCalendar';
import MaxTimeToggle from '../MaxTimeToggle';
import ControlledPeriodPicker from '../PeriodPicker';

export default function Fixed() {
  return (
    <Stack spacing={2} direction="column">
      <ControlledPeriodPicker />
      <Stack direction="column">
        <HideFromCalendar />
        <MaxTimeToggle />
      </Stack>
    </Stack>
  )
};
