/* eslint-disable react/display-name */
import React, { useMemo } from 'react';

import { Select } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { mapKeys } from 'lodash';

import prefixPN from '@assignables/helpers/prefixPN';

function capitalize(str) {
  return str?.[0]?.toUpperCase() + str?.substring(1, str.length);
}

export function useRoles() {
  const [, translations] = useTranslateLoader(prefixPN('roles'));

  return useMemo(() => {
    if (translations && translations.items) {
      const data = {};
      mapKeys(translations.items, (value, key) => {
        const [keyResult, singularOrPlural] = new RegExp(
          `(?<=${prefixPN('roles')}\\.).*(?=\\.(singular|plural))`
        ).exec(key);

        const keyResultExists = !!data[keyResult];

        if (!keyResultExists) {
          data[keyResult] = {};
        }

        data[keyResult][singularOrPlural] = value;
      });

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return Object.entries(data)
        .map(([key, value]) => ({
          label: capitalize(value.singular),
          plural: capitalize(value.plural),
          value: key,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }

    return [];
  }, [translations]);
}

const Type = React.forwardRef(({ labels, value, onChange }, ref) => {
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
});

export default Type;
