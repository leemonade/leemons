const permissionService = require('./services/private/permissions');
// const roleService = require('./services/private/roles');
const userService = require('./services/private/users');
const actionsService = require('./services/private/actions');
const { translations } = require('./services/private/translations');

async function init() {
  await actionsService.init();
  await permissionService.init();
  // await roleService.init();
  await userService.init();
  leemons.log.info('Plugin users init OK');
}

module.exports = init;
