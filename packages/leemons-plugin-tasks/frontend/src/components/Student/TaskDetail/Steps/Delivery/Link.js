import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, useDebouncedValue } from '@bubbles-ui/components';

import updateStudentRequest from '../../../../../request/instance/updateStudent';

function handleDeliverySubmission(instance, student) {
  return async (delivery) => {
    await updateStudentRequest({
      instance,
      student,
      metadata: {
        submission: delivery,
      },
    });
  };
}

export default function Link({ onError, onSubmit, onLoading, value, assignation }) {
  const [url, setUrl] = React.useState(value);
  const [debouncedUrl] = useDebouncedValue(url, 1000);
  const isFirstRender = React.useRef(true);

  const onLinkSubmission = handleDeliverySubmission(assignation.instance.id, assignation.user);

  React.useEffect(async () => {
    if (debouncedUrl?.length && !isFirstRender.current) {
      // TODO: Cancel previous request
      try {
        onLoading();
        await onLinkSubmission(debouncedUrl);
        onSubmit();
      } catch (e) {
        onError(e.message);
      }
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [debouncedUrl, onError, onSubmit, onLoading]);

  React.useEffect(() => {
    if (value !== url) {
      setUrl(value);
    }
  }, [value]);

  return <TextInput type="url" label="Submission link" value={url} onChange={setUrl} />;
}

Link.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};
