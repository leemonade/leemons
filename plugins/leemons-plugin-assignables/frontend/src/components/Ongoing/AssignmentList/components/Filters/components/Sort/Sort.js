/* eslint-disable react/display-name */
import prefixPN from '@assignables/helpers/prefixPN';
import { Select } from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import _ from 'lodash';
import React from 'react';

export function useSortTypes() {
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

const Sort = React.forwardRef(({ labels, value, onChange }, ref) => {
  const sortTypes = useSortTypes();

  return <Select label={labels?.sort} data={sortTypes} value={value} onChange={onChange} />;
});

export default Sort;
