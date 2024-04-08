import { useMemo } from 'react';
import prefixPN from '@assignables/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { escapeRegExp } from 'lodash';

export default function useRolesLocalizations(roles) {
  // key is array
  const keys = roles?.map((role) => prefixPN(`roles.${role}`));
  const [, translations] = useTranslateLoader(keys);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = {};
      Object.entries(translations.items).forEach(([key, value]) => {
        const match = new RegExp(
          `^${escapeRegExp(prefixPN('roles'))}\\.(?<role>.*)\\.(?<modifier>.*)`,
          'gm'
        ).exec(key);

        const role = match?.groups?.role;
        const modifier = match?.groups?.modifier;
        if (!res[role]) {
          res[role] = {};
        }

        res[role][modifier] = value;
      });

      return res;
    }

    return {};
  });
}
