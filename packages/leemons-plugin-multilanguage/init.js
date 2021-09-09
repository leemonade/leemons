const es = require('./src/i18n/es');
const en = require('./src/i18n/en');

async function init() {
  await leemons.plugin.services.common.getProvider().setManyByJSON(
    {
      es,
      en,
    },
    leemons.plugin.prefixPN('')
  );
}

module.exports = init;
