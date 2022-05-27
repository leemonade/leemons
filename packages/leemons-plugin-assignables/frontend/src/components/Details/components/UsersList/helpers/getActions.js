import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@bubbles-ui/components';

function CorrectionButton({ studentData, instanceData, label }) {
  const history = useHistory();

  const redirect = useCallback(() => {
    const urlTemplate = instanceData.assignable.roleDetails.evaluationDetailUrl;
    const url = urlTemplate.replace(':id', instanceData.id).replace(':user', studentData.user);
    history.push(url);
  }, [studentData, instanceData]);

  return <Button onClick={redirect}>{label}</Button>;
}

export default function getActions(studentData, instanceData, localizations) {
  if (studentData.finished) {
    return (
      <CorrectionButton
        studentData={studentData}
        instanceData={instanceData}
        label={localizations.evaluate}
      />
    );
  }

  if (!studentData.timestamps?.start) {
    return <Button variant="link">{localizations.sendReminder}</Button>;
  }
  return <></>;
}
