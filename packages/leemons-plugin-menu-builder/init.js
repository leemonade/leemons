const es = require();

async function init() {
  const exists = await leemons.plugin.services.menu.exist(
    leemons.plugin.config.constants.mainMenuKey
  );
  if (!exists) await leemons.plugin.services.menu.add(leemons.plugin.config.constants.mainMenuKey);
  console.log('Plugin Menu Builder init OK');
}

module.exports = init;
