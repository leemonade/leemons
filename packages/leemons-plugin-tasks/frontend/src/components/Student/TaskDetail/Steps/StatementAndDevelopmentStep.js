import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useApi } from '@common';

import { ContextContainer, HtmlText, Button, Box, Stack } from '@bubbles-ui/components';
import getTaskRequest from '../../../../request/task/getTask';

export default function StatementAndDevelopmentStep({ id, onNext, onPrevious }) {
  const options = useMemo(
    () => ({
      id,
      columns: JSON.stringify(['statement', 'development']),
    }),
    [id]
  );

  const [task] = useApi(getTaskRequest, options);

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
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};
