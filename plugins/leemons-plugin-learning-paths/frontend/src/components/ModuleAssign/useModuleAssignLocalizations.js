import { useMemo } from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { prefixPN } from '@learning-paths/helpers';
import { get } from 'lodash';

export function useModuleAssignLocalizations() {
  // key is string
  const keys = [
    prefixPN('assignation'),
    prefixPN('moduleSetup.steps.structureData.moduleComposer'),
  ];
  const [, translations] = useTranslateLoader(keys);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return {
        ...get(res, keys[0], {}),
        structureData: get(res, keys[1]),
      };
    }

    return {};
  });
}
