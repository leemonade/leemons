import tLoader from './tLoader';
import useTranslate from '../useTranslate';

function useCommonTranslate(_key) {
  const key = `plugins.multilanguage.${_key.toLowerCase()}`;
  const [translations] = useTranslate({ keysStartsWith: key });
  const t = tLoader(key, translations);
  return { t };
}

module.exports = useCommonTranslate;
