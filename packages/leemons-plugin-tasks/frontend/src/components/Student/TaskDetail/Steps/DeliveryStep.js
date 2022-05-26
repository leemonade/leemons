import React, { useMemo, useState, useCallback } from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import { ContextContainer, Alert, HtmlText } from '@bubbles-ui/components';

function SubmissionState({ submitted, loading, error, labels: _labels }) {
  const labels = _labels?.submission_state;

  if (error) {
    return (
      <Alert title={labels?.error?.title} severity="error" closeable={false}>
        {labels?.error?.message?.replace('{{error}}', error !== true ? error : '')}
      </Alert>
    );
  }
  if (loading) {
    return (
      <Alert title={labels?.loading?.title} severity="info" closeable={false}>
        {labels?.loading?.message}
      </Alert>
    );
  }
  if (submitted) {
    return (
      <Alert title={labels?.submitted?.title} severity="success" closeable={false}>
        {labels?.submitted?.message}
      </Alert>
    );
  }
  return (
    <Alert title={labels?.notSubmitted?.title} severity="info" closeable={false}>
      {labels?.notSubmitted?.message}
    </Alert>
  );
}
export default function DeliveryStep({ assignation, onNext, onPrev, labels: _labels }) {
  const labels = _labels?.submission_step;
  const { instance } = assignation;
  const { assignable } = instance;
  const { submission } = assignable;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(Boolean(assignation.metadata?.submission));

  // , metadata: {submission: submissionValue}
  onNext.current = () => !loading;

  onPrev.current = () => !loading;

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
    <ContextContainer title={labels.submission}>
      <HtmlText>{submission?.description}</HtmlText>
      <SubmissionState loading={loading} error={error} submitted={submitted} labels={labels} />
      <C
        assignation={assignation}
        onError={setError}
        onSubmit={onSubmit}
        onLoading={onLoading}
        value={assignation?.metadata?.submission}
        labels={labels}
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
