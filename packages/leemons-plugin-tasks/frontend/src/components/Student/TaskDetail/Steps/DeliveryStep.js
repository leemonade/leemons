import React, { useMemo } from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import { ContextContainer, Stack, Button, HtmlText } from '@bubbles-ui/components';
import updateStudentRequest from '../../../../request/instance/updateStudent';

function handleDeliverySubmission(instance, student) {
  return async (delivery) => {
    try {
      await updateStudentRequest({
        instance,
        student,
        metadata: {
          submission: delivery,
        },
      });
    } catch (e) {
      // Ignore error
    }
  };
}

export default function DeliveryStep({ assignation, onNext, onPrev }) {
  const { instance } = assignation;
  const { assignable } = instance;
  const { submission } = assignable;

  const onDeliverySubmission = useMemo(
    () => handleDeliverySubmission(instance?.id, assignation?.user),
    [assignation?.user, instance?.id]
  );
  // , metadata: {submission: submissionValue}
  onNext.current = () => true;

  onPrev.current = () => true;

  console.log(assignation);

  const Component = (type) =>
    loadable(() => {
      const validTypes = ['File', 'Link'];

      if (!validTypes.includes(type)) {
        return Promise.resolve(() => <></>);
      }

      return import(`./Delivery/${type}`);
    });

  const C = Component(submission.type);

  return (
    <ContextContainer title="Delivery">
      <HtmlText>{submission?.description}</HtmlText>
      <C
        submission={submission}
        onChange={onDeliverySubmission}
        value={assignation?.metadata?.submission}
      />
    </ContextContainer>
  );
}

DeliveryStep.propTypes = {
  assignation: PropTypes.shape({
    instance: PropTypes.shape({
      assignable: PropTypes.shape({
        submission: PropTypes.shape({
          type: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        }),
      }),
    }),
  }).isRequired,
};
