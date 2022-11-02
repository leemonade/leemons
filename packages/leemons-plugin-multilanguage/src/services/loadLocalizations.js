const es = require('../i18n/es');
const en = require('../i18n/en');

async function loadLocalizations() {
  await leemons.plugin.services.common.getProvider().setManyByJSON(
    {
      es,
      en,
    },
    leemons.plugin.prefixPN('')
  );
}

module.exports = loadLocalizations;
