import { useMemo } from 'react';
import unflatten from '@academic-portfolio/helpers/unflatten';
import get from 'lodash/get';
import useTranslateLoader from './useTranslateLoader';

function useTranslateObjectLoader(prefix) {
  const [, translations] = useTranslateLoader(prefix);

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = get(res, prefix);
      return data;
    }
    return {};
  }, [translations]);

  return labels;
}

export default useTranslateObjectLoader;
