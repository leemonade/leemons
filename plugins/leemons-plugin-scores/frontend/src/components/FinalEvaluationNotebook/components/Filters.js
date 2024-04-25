import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { SearchInput } from '@bubbles-ui/components';
import { noop } from 'lodash';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';

export default function Filters({ onChange = noop }) {
  const [t] = useTranslateLoader(prefixPN('evaluationNotebook.filters'));
  const [search, setSearch] = useState('');

  useEffect(() => {
    onChange({ search });
  }, [search, onChange]);

  return (
    <SearchInput
      value={search}
      placeholder={t('search', { type: t('searchTypes.student').toLowerCase() })}
      onChange={setSearch}
      sx={{ width: 220 }}
    />
  );
}

Filters.propTypes = {
  onChange: PropTypes.func,
};
