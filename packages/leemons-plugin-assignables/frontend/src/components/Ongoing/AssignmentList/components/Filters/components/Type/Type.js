import React, { useMemo } from 'react';
import { unflatten } from '@common';
import _ from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { Select } from '@bubbles-ui/components';
import prefixPN from '@assignables/helpers/prefixPN';

function capitalize(str) {
  return str[0].toUpperCase() + str.substring(1, str.length);
}

export function useRoles() {
  const [, translations] = useTranslateLoader(prefixPN('roles'));

  const roles = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('roles'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return Object.entries(data).map(([key, value]) => ({
        label: capitalize(value.singular),
        plural: capitalize(value.plural),
        value: key,
      }));
    }

    return [];
  }, [translations]);

  return roles;
}

export default function Type({ labels, value, onChange }) {
  const roles = useRoles();

  return (
    <Select
      label={labels?.type}
      data={[
        {
          label: labels?.seeAll,
          value: 'all',
        },
        ...roles,
      ]}
      value={value}
      onChange={onChange}
    />
  );
}
