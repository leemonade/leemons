import React from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import { ContextContainer, Stack, Button, HtmlText } from '@bubbles-ui/components';

import useTask from '../helpers/useTask';
import addDeliverableRequest from '../../../../request/instance/addDeliverable';
import useDeliverable from '../helpers/useDelivery';

export default function DeliveryStep({ assignation, onNext, onPrev }) {
  const { instance } = assignation;
  const { assignable } = instance;
  const { submission } = assignable;

  onNext.current = () => true;

  onPrev.current = () => false;

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
      <C submission={submission} onChange={() => {}} value={undefined} />
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
