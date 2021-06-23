const permissionService = require('./services/private/permissions');
// const roleService = require('./services/private/roles');
const userService = require('./services/private/users');
const actionsService = require('./services/private/actions');

async function init() {
  await actionsService.init();
  await permissionService.init();
  // await roleService.init();
  await userService.init();
  leemons.log.info('Plugin users-groups-roles init OK');
}

module.exports = init;
