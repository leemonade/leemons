const path = require('path');
const { translations } = require('./src/translations');

async function init() {
  const locales = translations();
  if (locales) {
    const localesData = {};
    const localesToAdd = ['es', 'en'];

    for (let i = 0, len = localesToAdd.length; i < len; i++) {
      const locale = localesToAdd[i];
      // eslint-disable-next-line no-await-in-loop
      localesData[locale] = await leemons.fs.readFile(
        path.resolve(__dirname, `./src/i18n/${locale}.json`),
        'utf8'
      );
      localesData[locale] = JSON.parse(localesData[locale]);
    }

    await locales.common.setManyByJSON(localesData, leemons.plugin.prefixPN(''));
  }
}

module.exports = init;
