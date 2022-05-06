import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';

// eslint-disable-next-line import/prefer-default-export
export function useTestsTypes() {
  const [t] = useTranslateLoader(prefixPN('testsEdit'));
  return [
    {
      label: t('learn'),
      value: 'learn',
      canGradable: true,
    },
  ];
}
