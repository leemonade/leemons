import React, { useMemo, useState, useEffect, useCallback } from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import { ContextContainer, Alert, HtmlText, Title } from '@bubbles-ui/components';

function SubmissionState({ status, error, labels: _labels }) {
  const labels = _labels?.submission_state;

  if (status === 'error' && error) {
    return (
      <Alert title={labels?.error?.title} severity="error" closeable={false}>
        {labels?.error?.message?.replace('{{error}}', error !== true ? error : '')}
      </Alert>
    );
  }
  if (status === 'loading') {
    return (
      <Alert title={labels?.loading?.title} severity="info" closeable={false}>
        {labels?.loading?.message}
      </Alert>
    );
  }
  if (status === 'submitted') {
    return (
      <Alert title={labels?.submitted?.title} severity="success" closeable={false}>
        {labels?.submitted?.message}
      </Alert>
    );
  }
  if (status === 'changed') {
    return (
      <Alert title={labels?.notSubmitted?.title} severity="info" closeable={false}>
        {labels?.notSubmitted?.message}
      </Alert>
    );
  }

  return null;
}
export default function DeliveryStep({ assignation, onSave, labels: _labels, disableButton }) {
  const labels = _labels?.submission_step;
  const { instance } = assignation;
  const { assignable } = instance;
  const { submission } = assignable;
  const [status, setStatus] = useState(assignation.metadata?.submission ? 'submitted' : 'cleared');
  const [error, setError] = useState(null);

  const updateStatus = (newStatus, e, firstRender) => {
    const availableStatus = ['cleared', 'submitted', 'changed', 'loading', 'error'];

    if (!availableStatus.includes(newStatus)) {
      throw new Error(`Invalid status ${newStatus}`);
    }

    setStatus(newStatus);

    if (newStatus === 'cleared' || newStatus === 'changed' || newStatus === 'error') {
      if (e) {
        setError(e);
      }

      // EN: If it is cleared and is the first render, disable the save button
      // ES: Si se ha borrado y es la primera renderización, deshabilitar el botón de guardar
      disableButton('save', !!(firstRender && newStatus === 'cleared'));
      disableButton('next', true);
    } else if (newStatus === 'submitted') {
      disableButton('save', true);
      disableButton('next', false);
    } else if (newStatus === 'loading') {
      disableButton('save', true);
      disableButton('next', true);
    }
    // TODO: Optional submission
  };

  useEffect(() => {
    updateStatus(status, false, true);
  }, []);

  // , metadata: {submission: submissionValue}
  // onNext.current = () => !loading;

  // onPrev.current = () => !loading;

  const Component = (type) =>
    loadable(() => {
      const validTypes = ['File', 'Link'];

      if (!validTypes.includes(type)) {
        return Promise.resolve(() => <></>);
      }

      return import(`./Delivery/${type}`);
    });

  const C = useMemo(() => Component(submission.type), [submission.type]);

  return (
    <ContextContainer>
      <Title color="primary" order={2}>
        {labels?.submission}
      </Title>
      <HtmlText>{submission?.description}</HtmlText>
      <C
        assignation={assignation}
        updateStatus={updateStatus}
        value={assignation?.metadata?.submission}
        onSave={onSave}
        labels={labels}
      />
      <SubmissionState status={status} error={error} labels={labels} />
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
