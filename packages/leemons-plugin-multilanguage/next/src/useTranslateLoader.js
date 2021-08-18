import useTranslate from './useTranslate';
import tLoader from './helpers/tLoader';

function useTranslateLoader(prefix) {
  const [translations] = useTranslate({ keysStartsWith: prefix });
  const t = tLoader(prefix, translations);
  return [t, translations];
}

module.exports = useTranslateLoader;
