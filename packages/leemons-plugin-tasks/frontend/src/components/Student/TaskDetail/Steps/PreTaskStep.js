import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Button, Text } from '@bubbles-ui/components';
import { useApi } from '@common';
import getTaskRequest from '../../../../request/task/getTask';

function getCondition(options) {
  if (options?.condition === 'take') {
    return 'Take the test';
  }
  if (options?.condition === 'greater') {
    return `Have more than ${options?.minScore} points`;
  }

  return 'NOT DEFINED';
}

export default function PreTaskStep({ onNext, id }) {
  const options = useMemo(
    () => ({
      id,
      columns: JSON.stringify(['preTask', 'preTaskOptions']),
    }),
    [id]
  );
  const [task] = useApi(getTaskRequest, options);

  return (
    <ContextContainer title="Pretask">
      <Text>Pre-Task id: {task?.preTask}</Text>
      <Text>
        Mandatory: {task?.preTaskOptions?.mandatory}, condition:{' '}
        {getCondition(task?.preTaskOptions)}
      </Text>
      <p>Aquí iría la info del Pretask</p>
      <Button onClick={onNext}>Next</Button>
    </ContextContainer>
  );
}

PreTaskStep.propTypes = {
  onNext: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
