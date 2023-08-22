import React from 'react';
import { ContextContainer } from '@bubbles-ui/components';
import { ScheduleInput } from '@timetable/components';

export default function TestPage() {
  return (
    <ContextContainer
      title="Timetable testing"
      alignItems="end"
      padded
      divided
      direction="row"
      fullWidth={false}
    >
      <ScheduleInput locale={'en'} onChange={(e) => console.log(e)} />
      <ScheduleInput locale={'en'} label={false} onChange={(e) => console.log(e)} />
    </ContextContainer>
  );
}
