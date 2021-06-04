const permissionService = require('../services/private/permissions');
const roleService = require('../services/private/roles');

async function init(ctx) {
  // TODO Borrar todo lo del init una vez tengamos una manera de inicializar los plugins
  await permissionService.init();
  await roleService.init();
  ctx.body = { permissions: 'ok', roles: 'ok' };
}

module.exports = {
  init,
};
