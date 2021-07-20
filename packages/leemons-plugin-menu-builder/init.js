const es = require('./src/i18n/es');
const en = require('./src/i18n/en');
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
      leemons.plugin.prefixPN('')
    );
  }
  console.log('Plugin Menu Builder init OK');
}

module.exports = init;
