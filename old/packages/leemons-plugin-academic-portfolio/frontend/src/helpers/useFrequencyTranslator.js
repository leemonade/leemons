import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';

export function useFrequencyTranslator() {
  const [t, tr, ...props] = useTranslateLoader(prefixPN('programs_page.setup.frequencies'));
  const translations = {};
  if (tr) {
    Object.keys(tr.items).forEach((oKey) => {
      const keys = oKey.split('.');
      const key = keys[keys.length - 1];
      translations[key] = tr.items[oKey];
    });
  }
  return [t, translations, ...props];
}
