/* eslint-disable import/prefer-default-export */
import { PLUGIN_NAME } from '../../constants';

async function getLocale(lang, page) {
  return leemons.api(`v1/${PLUGIN_NAME}/i18n/${page}/${lang}`);
}

export { getLocale as getLocaleRequest };
