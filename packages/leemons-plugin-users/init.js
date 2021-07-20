const es = require('./src/i18n/es');
const en = require('./src/i18n/en');
const permissionService = require('./src/services/permissions');
const userService = require('./src/services/users');
const actionsService = require('./src/services/actions');
const { translations } = require('./src/services/translations');
const { addMain, addUsers, addProfiles } = require('./src/services/menu-builder');

async function init() {
  try {
    await actionsService.init();
    await permissionService.init();
    await userService.init();
  } catch (e) {}

  try {
    // Menu builder
    await addMain();
    await addUsers();
    await addProfiles();
  } catch (e) {}

  if (translations()) {
    await translations().common.setManyByJSON(
      {
        es,
        en,
      },
      leemons.plugin.prefixPN('')
    );
  }

  leemons.log.info('Plugin users init OK');
}

module.exports = init;
