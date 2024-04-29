import React from 'react';
import PropTypes from 'prop-types';

import { SearchInput } from '@bubbles-ui/components';
import { noop } from 'lodash';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';

export default function Filters({ onChange = noop, value }) {
  const [t] = useTranslateLoader(prefixPN('evaluationNotebook.filters'));

  return (
    <SearchInput
      value={value?.search ?? ''}
      placeholder={t('search', { type: t('searchTypes.student').toLowerCase() })}
      onChange={(search) => onChange({ search })}
      sx={{ width: 220 }}
    />
  );
}

Filters.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.object,
};
