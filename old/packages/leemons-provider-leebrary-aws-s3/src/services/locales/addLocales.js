const path = require('path');
const { flattenDeep } = require('lodash');
const fs = require('fs/promises');
const { translations } = require('../translations');

async function addLocales(langs) {
  const locales = flattenDeep([langs]);
  const languageService = translations();

  if (languageService) {
    const localesData = {};

    for (let i = 0, len = locales.length; i < len; i++) {
      const locale = locales[i];
      const localePath = path.resolve(__dirname, `../../i18n/${locale}.json`);
      try {
        // eslint-disable-next-line no-await-in-loop
        localesData[locale] = await fs.readFile(localePath, 'utf8');
        localesData[locale] = JSON.parse(localesData[locale]);
      } catch (err) {
        console.error(err);
        leemons.log.error(`Unable to load locale: ${localePath}`);
      }
    }
    await languageService.common.setManyByJSON(localesData, leemons.provider.prefixPN(''));
  }
}

module.exports = { addLocales };
