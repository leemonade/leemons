const permissionService = require('../services/private/permissions');
const roleService = require('../services/private/roles');
const userService = require('../services/private/users');
const actionsService = require('../services/private/actions');

async function init(ctx) {
  // TODO Borrar todo lo del init una vez tengamos una manera de inicializar los plugins
  await actionsService.init();
  await permissionService.init();
  // await roleService.init();
  await userService.init();
  ctx.body = { permissions: 'ok', roles: 'ok', users: 'ok' };
}

module.exports = {
  init,
};
