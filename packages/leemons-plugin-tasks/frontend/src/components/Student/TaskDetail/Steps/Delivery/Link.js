import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, useDebouncedValue } from '@bubbles-ui/components';

export default function Link({ onChange, value }) {
  const [url, setUrl] = React.useState('');
  const [debouncedUrl] = useDebouncedValue(url, 200);

  React.useEffect(() => {
    if (debouncedUrl?.length) {
      onChange(debouncedUrl);
    }
  }, [debouncedUrl, onChange]);

  React.useEffect(() => {
    setUrl(value);
  }, [value]);

  return <TextInput label="Submission link" value={url} onChange={setUrl} />;
}

Link.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};
