import React from 'react';
import dayjs from 'dayjs';
import { Button } from '@bubbles-ui/components';

export default function getActions(studentData, instanceData) {
  if (instanceData.dates.deadline && dayjs(instanceData).isBefore(dayjs())) {
    if (!studentData.timestamps.end) {
      return (
        <>
          <Button>CORREGIR</Button>
          <Button>ENVIAR RECORDATORIO</Button>;
        </>
      );
    }

    return <Button>CORREGIR</Button>;
  }
  if (studentData.timestamps?.end) {
    return <Button>CORREGIR</Button>;
  }
  if (!studentData.timestamps?.start) {
    return <Button>ENVIAR RECORDATORIO</Button>;
  }
  return <></>;
}
