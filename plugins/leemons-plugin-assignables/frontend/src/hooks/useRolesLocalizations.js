import { useMemo } from 'react';
import prefixPN from '@assignables/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { get } from 'lodash';

export default function useRolesLocalizations(roles) {
  // key is array
  const keys = roles?.map((role) => prefixPN(`roles.${role}`));
  const [, translations] = useTranslateLoader(keys);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return get(res, prefixPN('roles'), {});
    }

    return {};
  });
}
