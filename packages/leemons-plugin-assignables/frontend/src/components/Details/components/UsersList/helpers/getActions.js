import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { Button } from '@bubbles-ui/components';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '../../../../../helpers/prefixPN';

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
    return <Button>{localizations.sendReminder}</Button>;
  }
  return <></>;
}
