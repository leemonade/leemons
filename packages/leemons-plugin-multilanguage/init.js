const localesTable = leemons.query('plugins_multilanguage::locales');

const Locales = require('./src/services/locale');

async function init() {
  const locales = new Locales({ model: localesTable });
  await locales.addMany([
    ['es-ES', 'Español de España'],
    ['en', 'English'],
    ['en-UK', 'English UK'],
  ]);
}

module.exports = init;
