import React, { useMemo } from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import {
  ContextContainer,
  Stack,
  Button,
  Text,
  Alert,
  Paper,
  HtmlText,
} from '@bubbles-ui/components';

import { useApi } from '@common';
import getTaskRequest from '../../../../request/task/getTask';
import useTask from '../helpers/useTask';

export default function DeliveryStep({ onNext, onPrevious, id }) {
  const task = useTask(id, ['submissions']);

  const Component = (type) =>
    loadable(() => {
      const validTypes = ['File', 'Link'];

      if (!validTypes.includes(type)) {
        return Promise.resolve(() => <></>);
      }

      return import(`./Delivery/${type}`);
    });

  const C = Component(task?.submissions?.type);

  return (
    <ContextContainer title="Delivery">
      <HtmlText>{task?.submissions?.description}</HtmlText>
      <C task={task} />
      <Stack fullWidth justifyContent="space-between">
        <Button onClick={onPrevious}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </Stack>
    </ContextContainer>
  );
}

DeliveryStep.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
