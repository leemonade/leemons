import React, { useMemo } from 'react';
import { unflatten } from '@common';
import _ from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import CenterAlignedSelect from '../CenterAlignedSelect';
import prefixPN from '../../../../../../../helpers/prefixPN';

function useRoles() {
  const [, translations] = useTranslateLoader(prefixPN('roles'));

  const roles = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('roles'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return Object.entries(data).map(([key, value]) => ({
        label: value,
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
    <CenterAlignedSelect
      orientation="horizontal"
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
