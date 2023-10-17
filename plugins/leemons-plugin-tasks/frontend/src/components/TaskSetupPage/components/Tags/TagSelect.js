import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { MultiSelect } from '@bubbles-ui/components';
import { useApi } from '@common';
import listTags from '../../../../request/tags/list';

export default function TagSelect({ labels, placeholders }) {
  const [data, setData] = useState([]);
  const [extraTags, setExtraTags] = useState([]);
  const { control } = useFormContext();

  const [tags, , loading] = useApi(listTags);

  useEffect(() => {
    if (!loading) {
      setData(tags.map((t) => ({ label: t, value: t })));
    }
  }, [tags, loading]);

  return (
    <Controller
      control={control}
      name="tags"
      render={({ field }) => (
        <MultiSelect
          {...field}
          label={labels?.tags}
          placeholder={placeholders?.tags}
          data={data.concat(extraTags)}
          creatable
          searchable
          multiple
          getCreateLabel={(tag) => `+ ${tag}`}
          onCreate={(tag) => setExtraTags((d) => [...d, { label: tag, value: tag }])}
        />
      )}
    />
  );
}

TagSelect.propTypes = {
  labels: PropTypes.shape({
    tags: PropTypes.string,
  }),
  placeholders: PropTypes.shape({
    tags: PropTypes.string,
  }),
};
