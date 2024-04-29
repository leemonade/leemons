import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import _ from 'lodash';
import React from 'react';

export default function usePeriodTypes() {
  const [, translations] = useTranslateLoader(prefixPN('periodTypes'));

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return _.get(res, prefixPN('periodTypes'));
    }

    return {};
  }, [translations]);
}
