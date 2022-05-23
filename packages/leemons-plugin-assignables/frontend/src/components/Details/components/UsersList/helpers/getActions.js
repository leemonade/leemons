import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { Button } from '@bubbles-ui/components';

function CorrectionButton({ studentData, instanceData }) {
  const history = useHistory();

  const redirect = useCallback(() => {
    const urlTemplate = instanceData.assignable.roleDetails.evaluationDetailUrl;
    const url = urlTemplate.replace(':id', instanceData.id).replace(':user', studentData.user);
    history.push(url);
  }, [studentData, instanceData]);

  return <Button onClick={redirect}>Corregir</Button>;
}

export default function getActions(studentData, instanceData) {
  if (studentData.finished) {
    return <CorrectionButton studentData={studentData} instanceData={instanceData} />;
  }

  if (!studentData.timestamps?.start) {
    return <Button>ENVIAR RECORDATORIO</Button>;
  }
  return <></>;
}
