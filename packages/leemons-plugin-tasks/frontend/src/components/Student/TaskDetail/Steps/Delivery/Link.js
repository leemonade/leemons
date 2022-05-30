import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, useDebouncedValue } from '@bubbles-ui/components';
import handleDeliverySubmission from './handleDeliverySubmission';

export default function Link({ updateStatus, value, assignation, labels: _labels }) {
  const labels = _labels?.submission_type?.link;
  const [url, setUrl] = React.useState(value);
  const [debouncedUrl] = useDebouncedValue(url, 1000);
  const isFirstRender = React.useRef(true);

  const onLinkSubmission = handleDeliverySubmission(assignation);

  React.useEffect(async () => {
    if (debouncedUrl?.length && !isFirstRender.current) {
      // TODO: Cancel previous request
      try {
        updateStatus('loading');
        await onLinkSubmission(debouncedUrl);
        updateStatus(debouncedUrl?.length ? 'submitted' : 'cleared');
      } catch (e) {
        updateStatus('error', e.message);
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

  return <TextInput type="url" label={labels?.link} value={url} onChange={setUrl} />;
}

Link.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};
