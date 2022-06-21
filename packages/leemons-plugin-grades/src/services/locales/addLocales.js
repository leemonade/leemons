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
      // eslint-disable-next-line import/no-dynamic-require
      localesData[locale] = require(path.resolve(__dirname, `../../i18n/${locale}.js`));
    }

    await languageService.common.setManyByJSON(localesData, leemons.plugin.prefixPN(''));
  }
}

module.exports = { addLocales };
