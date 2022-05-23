import React from 'react';
import dayjs from 'dayjs';
import { Button } from '@bubbles-ui/components';

// function CorrectionButton() {
//   return <Button onClick={}>Corregir</Button>
// }

export default function getActions(studentData) {
  if (studentData.finished) {
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

  if (!studentData.timestamps?.start) {
    return <Button>ENVIAR RECORDATORIO</Button>;
  }
  return <></>;
}
