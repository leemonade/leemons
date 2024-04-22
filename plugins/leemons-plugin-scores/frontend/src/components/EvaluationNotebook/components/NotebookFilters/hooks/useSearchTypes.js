import { useMemo } from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';

export default function useSearchTypes() {
  const [t] = useTranslateLoader(prefixPN('evaluationNotebook.filters'));
  return useMemo(
    () => [
      { label: t('searchTypes.student'), value: 'student' },
      { label: t('searchTypes.activity'), value: 'activity' },
    ],
    [t]
  );
}
