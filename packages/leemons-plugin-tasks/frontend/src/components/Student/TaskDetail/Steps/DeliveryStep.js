import React, { useMemo, useState, useCallback } from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import { ContextContainer, Alert, HtmlText } from '@bubbles-ui/components';

function SubmissionState({ submitted, loading, error }) {
  if (error) {
    return (
      <Alert title="Error" severity="error" closeable={false}>
        Unable to submit the task: {error !== true ? error : ''}
      </Alert>
    );
  }
  if (loading) {
    return (
      <Alert title="Submitting" severity="info" closeable={false}>
        Submitting the task
      </Alert>
    );
  }
  if (submitted) {
    return (
      <Alert title="Submitted" severity="success" closeable={false}>
        The task has been submitted
      </Alert>
    );
  }
  return (
    <Alert title="Not submitted" severity="info" closeable={false}>
      The task has not been submitted yet
    </Alert>
  );
}
export default function DeliveryStep({ assignation, onNext, onPrev }) {
  const { instance } = assignation;
  const { assignable } = instance;
  const { submission } = assignable;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(Boolean(assignation.metadata?.submission));

  // , metadata: {submission: submissionValue}
  onNext.current = () => !loading;

  onPrev.current = () => !loading;

  console.log(assignation);

  const Component = (type) =>
    loadable(() => {
      const validTypes = ['File', 'Link'];

      if (!validTypes.includes(type)) {
        return Promise.resolve(() => <></>);
      }

      return import(`./Delivery/${type}`);
    });

  const C = useMemo(() => Component(submission.type), [submission.type]);

  const onSubmit = useCallback(
    (isSubmitted) => {
      setError(null);
      setSubmitted(isSubmitted);
      setLoading(false);
    },
    [setLoading, setSubmitted, setError]
  );
  const onLoading = useCallback(() => {
    setLoading(true);
    setSubmitted(false);
    setError(null);
  }, [setLoading, setSubmitted, setError]);

  return (
    <ContextContainer title="Delivery">
      <HtmlText>{submission?.description}</HtmlText>
      <SubmissionState loading={loading} error={error} submitted={submitted} />
      <C
        assignation={assignation}
        onError={setError}
        onSubmit={onSubmit}
        onLoading={onLoading}
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
