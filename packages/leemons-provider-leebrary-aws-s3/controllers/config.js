const { getConfig: _getConfig } = require('../src/services/provider');
const { removeConfig } = require('../src/services/provider');
const { setConfig: _setConfig } = require('../src/services/provider');

async function getConfig(ctx) {
  const isSuperAdmin = await leemons
    .getPlugin('users')
    .services.users.isSuperAdmin(ctx.state.userSession.id);

  if (isSuperAdmin) {
    const config = await _getConfig();
    ctx.status = 200;
    ctx.body = { status: 200, config };
  } else {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      message: 'Only can super admin',
    };
  }
}

module.exports = {
  getConfig,
};
