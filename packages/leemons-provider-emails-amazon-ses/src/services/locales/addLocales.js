/* eslint-disable global-require */
const path = require('path');
const { flattenDeep } = require('lodash');
const { translations } = require('../../translations');

async function addLocales(langs) {
  const locales = flattenDeep([langs]);
  const languageService = translations();

  if (languageService) {
    const localesData = {};

    for (let i = 0, len = locales.length; i < len; i++) {
      const locale = locales[i];
      const localePath = path.resolve(__dirname, `../../i18n/${locale}.js`);
      try {
        // eslint-disable-next-line import/no-dynamic-require
        localesData[locale] = require(localePath);
      } catch (err) {
        leemons.log.error(`Unable to load locale: ${localePath}`);
      }
    }

    await languageService.common.setManyByJSON(localesData, leemons.provider.prefixPN(''));
  }
}

module.exports = { addLocales };
