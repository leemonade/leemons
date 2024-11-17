import React, { useMemo, useState, useEffect, useCallback } from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import { ContextContainer, Alert, HtmlText, Title, Box, Button } from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';

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

function buttonsToSet({
  status,
  hasPrevStep,
  hasNextStep,
  onPrevStep,
  onNextStep,
  onSave,
  localizations,
  preview,
}) {
  let next = true;
  let save = true;

  if (status === 'cleared') {
    save = false;
    next = false;
  } else if (['error', 'changed'].includes(status)) {
    next = true;
    save = true;
  } else if (status === 'submitted') {
    save = false;
    next = true;
  } else if (status === 'loading') {
    save = false;
    next = false;
  }

  if (preview) {
    save = false;
  }

  return (
    <>
      <Box>
        {hasPrevStep && (
          <Button onClick={onPrevStep} variant="link" rounded leftIcon={<ChevLeftIcon />}>
            {localizations?.buttons?.previous}
          </Button>
        )}
      </Box>
      <Box sx={(theme) => ({ display: 'flex', gap: theme.spacing[4] })}>
        <Button variant="outline" onClick={() => onSave.current()} disabled={!save} rounded>
          {localizations?.buttons?.save}
        </Button>

        <Button
          variant={hasNextStep ? 'outline' : 'filled'}
          onClick={async () => {
            const canContinue = await onSave.current();

            if (canContinue) {
              onNextStep();
            }
          }}
          disabled={!next || (!hasNextStep && preview)}
          rounded
          rightIcon={hasNextStep && <ChevRightIcon />}
        >
          {hasNextStep ? localizations?.buttons?.next : localizations?.buttons?.submit}
        </Button>
      </Box>
    </>
  );
}

export default function DeliveryStep({
  assignation,
  updateTimestamps,
  setButtons,
  onPrevStep,
  onNextStep,
  hasPrevStep,
  hasNextStep,
  localizations: _labels,
  preview,
}) {
  React.useEffect(() => {
    updateTimestamps('start');
  }, [assignation?.id]);
  const onSave = React.useRef(null);

  const labels = _labels?.submission_step;
  const { instance } = assignation;
  const { assignable } = instance;
  const { submission } = assignable;
  const [status, setStatus] = useState(assignation.metadata?.submission ? 'submitted' : 'cleared');
  const [error, setError] = useState(null);

  const updateStatus = (newStatus, e) => {
    const availableStatus = ['cleared', 'submitted', 'changed', 'loading', 'error'];

    if (!availableStatus.includes(newStatus)) {
      throw new Error(`Invalid status ${newStatus}`);
    }

    setStatus(newStatus);
    if (e) {
      setError(e);
    }

    // TODO: Optional submission
  };

  useEffect(() => {
    updateStatus(status);
  }, []);

  useEffect(() => {
    setButtons(
      buttonsToSet({
        status,
        hasPrevStep,
        hasNextStep,
        onPrevStep,
        onNextStep,
        onSave,
        localizations: _labels,
        preview,
      })
    );
  }, [status, hasPrevStep, hasNextStep, onPrevStep, onNextStep, _labels?.buttons, preview]);

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
