import React from 'react';
import { get } from 'lodash';
import prefixPN from '@assignables/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';

export default function useNyaLocalizations() {
  const localizationKeys = [
    prefixPN('need_your_attention'),
    prefixPN('roles'),
    prefixPN('multiSubject'),
  ];

  const [, translations] = useTranslateLoader(localizationKeys);

  return React.useMemo(() => {
    if (!translations?.items) {
      return {};
    }

    const res = unflatten(translations.items);
    const nya = get(res, localizationKeys[0]);
    const roles = get(res, localizationKeys[1]);
    const multiSubject = get(res, localizationKeys[2]);

    return {
      nya,
      roles,
      multiSubject,
    };
  }, [translations]);
}
