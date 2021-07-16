const es = require('./src/i18n/es');
const en = require('./src/i18n/en');
const prefixPN = require('./src/helpers/prefixPN');
const { translations } = require('./src/translations');

async function init() {
  const exists = await leemons.plugin.services.menu.exist(
    leemons.plugin.config.constants.mainMenuKey
  );
  if (!exists) await leemons.plugin.services.menu.add(leemons.plugin.config.constants.mainMenuKey);

  if (translations()) {
    await translations().common.setManyByJSON(
      {
        es,
        en,
      },
      prefixPN('')
    );
  }
  console.log('Plugin Menu Builder init OK');
}

module.exports = init;
