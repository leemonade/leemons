import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useApi } from '@common';

import { ContextContainer, HtmlText, Button, Stack } from '@bubbles-ui/components';
import getTaskRequest from '../../../../request/task/getTask';

import updateStudentRequest from '../../../../request/instance/updateStudent';

export default function StatementAndDevelopmentStep({ id, instance, student, onNext, onPrevious }) {
  const options = useMemo(
    () => ({
      id,
      columns: JSON.stringify(['statement', 'development']),
    }),
    [id]
  );

  const [task] = useApi(getTaskRequest, options);
  useEffect(() => {
    updateStudentRequest({
      instance,
      student,
      key: 'start',
      value: new Date().getTime(),
    });
  }, []);

  return (
    <ContextContainer>
      <ContextContainer title="Statement">
        <HtmlText>{task?.statement}</HtmlText>
      </ContextContainer>
      <ContextContainer title="Development">
        <HtmlText>{task?.development}</HtmlText>
      </ContextContainer>
      <Stack fullWidth justifyContent="space-between">
        <Button onClick={onPrevious}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </Stack>
    </ContextContainer>
  );
}

StatementAndDevelopmentStep.propTypes = {
  id: PropTypes.string.isRequired,
  student: PropTypes.string.isRequired,
  instance: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};
