import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@bubbles-ui/components';

function CorrectionButton({ studentData, instanceData, label, variant = 'outline' }) {
  const history = useHistory();

  const redirect = useCallback(() => {
    const urlTemplate = instanceData.assignable.roleDetails.evaluationDetailUrl;
    const url = urlTemplate.replace(':id', instanceData.id).replace(':user', studentData.user);
    history.push(url);
  }, [studentData, instanceData]);

  return (
    <Button variant={variant} onClick={redirect}>
      {label}
    </Button>
  );
}

export default function getActions(
  studentData,
  instanceData,
  localizations,
  subjects,
  { reminder, score }
) {
  if (studentData.finished) {
    if (!instanceData?.requiresScoring && !instanceData?.allowFeedback) {
      return null;
    }

    const grades = studentData.grades?.filter((grade) => grade.type === 'main');
    if (grades?.length >= subjects?.length) {
      return (
        <CorrectionButton
          variant="link"
          studentData={studentData}
          instanceData={instanceData}
          label={`${score ? `(${score}) ` : ''}${localizations.review}`}
        />
      );
    }
    return (
      <CorrectionButton
        studentData={studentData}
        instanceData={instanceData}
        label={localizations.evaluate}
      />
    );
  }

  if (!studentData.timestamps?.start) {
    return (
      <Button
        variant="link"
        onClick={() => {
          reminder(studentData);
        }}
      >
        {localizations.sendReminder}
      </Button>
    );
  }
  return <></>;
}
