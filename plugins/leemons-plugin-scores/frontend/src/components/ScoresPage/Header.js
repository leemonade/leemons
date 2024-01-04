import { TotalLayoutHeader } from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN as _prefixPN } from '@scores/helpers';
import _ from 'lodash';
import React, { useMemo } from 'react';

function useHeaderLocalizations({ prefixPN, variant }) {
  const prefix = prefixPN || _prefixPN;
  const key = prefix(`${variant}.header.teacher`);
  const [, translations] = useTranslateLoader(key);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return _.get(res, key);
    }

    return {};
  }, [translations]);
}

export function Header({ prefixPN, variant }) {
  const localizations = useHeaderLocalizations({ prefixPN, variant });

  return <TotalLayoutHeader title={localizations?.title} cancelable={false} />;
}

export default Header;
