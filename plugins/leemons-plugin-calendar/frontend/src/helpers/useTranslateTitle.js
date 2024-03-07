import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@calendar/helpers/prefixPN';

export default function useTranslateTitle(trans) {
  let t = trans;
  let loading = false;
  if (!t) {
    const [ts, , , loadingg] = useTranslateLoader(prefixPN('transformEvent'));
    t = ts;
    loading = loadingg;
  }
  return [
    (title) => title.replace('{-_start_-}', t('start')).replace('{-_end_-}', t('end')),
    t,
    loading,
  ];
}
