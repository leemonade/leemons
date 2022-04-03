import React from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import { ContextContainer, Stack, Button, HtmlText } from '@bubbles-ui/components';

import useTask from '../helpers/useTask';
import addDeliverableRequest from '../../../../request/instance/addDeliverable';
import useDeliverable from '../helpers/useDelivery';

export default function DeliveryStep({ onNext, onPrevious, instance, student, id }) {
  const task = useTask(id, ['submissions']);
  const deliverable = useDeliverable(instance, student, 'submission');

  const handleSubmission = React.useCallback(
    (value) => {
      addDeliverableRequest({
        instance,
        user: student,
        type: 'submission',
        deliverable: {
          type: task?.submissions?.type,
          value,
        },
      });
    },
    [instance, student, task?.submissions?.type]
  );

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
      <C task={task} onChange={handleSubmission} value={deliverable?.value} />
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
  instance: PropTypes.string.isRequired,
  student: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
