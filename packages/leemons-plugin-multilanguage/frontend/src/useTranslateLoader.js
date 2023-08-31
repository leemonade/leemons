import { useMemo } from 'react';
import tLoader from './helpers/tLoader';
import useTranslate from './useTranslate';

function useTranslateLoader(prefix) {
  const [translations, error, loading] = useTranslate({ keysStartsWith: prefix });
  const t = useMemo(() => tLoader(prefix, translations), [prefix, translations]);
  return [t, translations, error, loading];
}

export default useTranslateLoader;
