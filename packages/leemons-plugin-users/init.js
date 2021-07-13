const permissionService = require('./src/services/permissions');
// const roleService = require('./services/private/roles');
const userService = require('./src/services/users');
const actionsService = require('./src/services/actions');
const { addMain, addUsers, addProfiles } = require('./src/services/menu-builder');

async function init() {
  await actionsService.init();
  await permissionService.init();
  // await roleService.init();
  await userService.init();

  // Menu builder
  await addMain();
  await addUsers();
  await addProfiles();

  leemons.log.info('Plugin users init OK');
}

module.exports = init;
