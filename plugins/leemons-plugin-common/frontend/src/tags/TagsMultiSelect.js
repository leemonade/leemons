import React from 'react';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';
import { MultiSelect, useDebouncedCallback } from '@bubbles-ui/components';
import { useStore } from '../useStore';
import { TagsService } from './TagsService';

function TagsMultiSelect({ pluginName, type, ...props }) {
  if (!isArray(props.value)) {
    // eslint-disable-next-line no-param-reassign
    props.value = [];
  }

  const [store, render] = useStore({ data: [], newTags: [] });
  const callback = useDebouncedCallback(500);

  async function search(text) {
    callback(async () => {
      const query = { tag_$contains: text };
      if (type) query.type = type;
      const result = await TagsService.listTags(pluginName, 0, 10, query);
      store.data = result.data.items;
      render();
    });
  }

  function onCreate(text) {
    store.newTags.push({ value: text, label: text });
    render();
  }

  React.useEffect(() => {
    search('');
  }, []);

  return (
    <MultiSelect
      {...props}
      data={store.data.concat(store.newTags)}
      searchable
      creatable
      getCreateLabel={(query) => `+ ${query}`}
      onSearchChange={search}
      onCreate={onCreate}
    />
  );
}

TagsMultiSelect.propTypes = {
  pluginName: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.array,
};

// eslint-disable-next-line import/prefer-default-export
export { TagsMultiSelect };
