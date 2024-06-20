import { FormWithTheme } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

function useFormWithTheme(schema, ui, conditions, props = {}, adds = {}) {
  const [t, translations] = useTranslateLoader('multilanguage.formWithTheme');
  // TODO: Add another parameter where an onUserSearch is passed and it searches for users in the backend and returns the format needed for the select
  return FormWithTheme(schema, ui, conditions, props, { ...adds, t, translations });
}

export { useFormWithTheme };
