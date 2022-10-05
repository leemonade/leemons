import React, { useState, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@bubbles-ui/components';
import handleDeliverySubmission from './handleDeliverySubmission';

export default function Link({ updateStatus, value, assignation, labels: _labels, onSave }) {
  const labels = _labels?.submission_type?.link;
  const [url, setUrl] = useState(value);
  const urlRef = useRef(value);

  const saveSubmission = useMemo(() => handleDeliverySubmission(assignation), [assignation]);

  const handleSubmit = useCallback(async () => {
    updateStatus('loading');
    const urlToSave = urlRef.current;

    if (urlToSave.length) {
      try {
        // eslint-disable-next-line no-new
        new URL(urlToSave);
      } catch (e) {
        updateStatus('error', labels?.invalidURL);
        return false;
      }
    }

    try {
      await saveSubmission(urlToSave, !urlToSave?.length);
      updateStatus(urlToSave.length ? 'submitted' : 'cleared');
    } catch (e) {
      if (e.message !== 'No changes detected') {
        updateStatus('error', e.message);
        return false;
      }
    }

    return true;
  }, [updateStatus, saveSubmission, _labels]);

  onSave.current = handleSubmit;

  return (
    <TextInput
      type="url"
      label={labels?.link}
      value={url}
      onChange={(newUrl) => {
        updateStatus('changed');
        urlRef.current = newUrl;
        setUrl(newUrl);
      }}
    />
  );
}

Link.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};
