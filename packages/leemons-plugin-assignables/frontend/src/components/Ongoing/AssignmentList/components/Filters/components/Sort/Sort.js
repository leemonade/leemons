import { listSessionClassesRequest } from '@academic-portfolio/request';
import React from 'react';
import _ from 'lodash';
import { unflatten, useApi } from '@common';
import { Select } from '@bubbles-ui/components';
import prefixPN from '@assignables/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

function useSortTypes() {
  const [, translations] = useTranslateLoader(prefixPN('sortTypes'));

  const localizations = React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('sortTypes'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  // TRANSLATE
  const sortTypes = React.useMemo(
    () =>
      Object.entries(localizations).map(([key, value]) => ({
        value: key,
        label: value,
      })),
    [localizations]
  );

  return sortTypes;
}

export default function Sort({ labels, value, onChange }) {
  const sortTypes = useSortTypes();

  return <Select label={labels?.sort} data={sortTypes} value={value} onChange={onChange} />;
}
