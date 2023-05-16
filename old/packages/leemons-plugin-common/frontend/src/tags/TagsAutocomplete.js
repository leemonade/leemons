import React from 'react';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';
import { TagsInput } from '@bubbles-ui/components';
import { useStore } from '../useStore';
import { TagsService } from './TagsService';

function TagsAutocomplete({ pluginName, type, ...props }) {
  if (!isArray(props.value)) {
    // eslint-disable-next-line no-param-reassign
    props.value = [];
  }

  const [store, render] = useStore({ data: [] });

  async function search(text) {
    const query = { tag_$contains: text };
    if (type) query.type = type;
    const result = await TagsService.listTags(pluginName, 0, 10, query);
    store.data = result?.data?.items || [];
    render();
  }

  React.useEffect(() => {
    search('');
  }, []);

  return <TagsInput {...props} suggestions={store.data} onSearch={search} />;
}

TagsAutocomplete.propTypes = {
  pluginName: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.array,
  onChange: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { TagsAutocomplete };
