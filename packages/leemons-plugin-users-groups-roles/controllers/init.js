const permissionService = require('../services/private/permissions');
const roleService = require('../services/private/roles');
const userService = require('../services/private/users');

async function init(ctx) {
  // TODO Borrar todo lo del init una vez tengamos una manera de inicializar los plugins
  await permissionService.init();
  leemons.log.info(`Permissions init done`);
  await roleService.init();
  leemons.log.info(`Roles init done`);
  await userService.init();
  leemons.log.info(`Users init done`);
  ctx.body = { permissions: 'ok', roles: 'ok', users: 'ok' };
}

module.exports = {
  init,
};
