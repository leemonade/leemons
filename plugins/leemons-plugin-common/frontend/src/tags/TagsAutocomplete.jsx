import React from 'react';
import PropTypes from 'prop-types';
import { isArray, escapeRegExp } from 'lodash';
import { TagsInput } from '@bubbles-ui/components';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { useStore } from '../useStore';
import { TagsService } from './TagsService';

function TagsAutocomplete({ pluginName, type, labels, value: valueProp, ...props }) {
  const { t: tCommon } = useCommonTranslate('formWithTheme');
  const [value, setValue] = React.useState(valueProp);
  const [store, render] = useStore({ data: [] });

  async function search(text) {
    const query = { tag: { $regex: escapeRegExp(text), $options: 'i' } };
    if (type) {
      query.type = type.replace(/\.$/, '');
    }
    const result = await TagsService.listTags(pluginName, 0, 10, query);
    store.data = result?.data?.items || [];
    render();
  }

  React.useEffect(() => {
    search('');
  }, []);

  React.useEffect(() => {
    setValue(valueProp ?? []);
  }, [valueProp]);

  return (
    <TagsInput
      {...props}
      value={value}
      labels={{ ...labels, addButton: labels?.addButton ?? tCommon('add') }}
      suggestions={store.data}
      onSearch={search}
    />
  );
}

TagsAutocomplete.propTypes = {
  pluginName: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.array,
  onChange: PropTypes.func,
  labels: PropTypes.object,
};

// eslint-disable-next-line import/prefer-default-export
export { TagsAutocomplete };
