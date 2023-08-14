const socketService = require('../src/services/socket');

async function getCredentials(ctx) {
  const credentials = await socketService.createCredentialsForUserSession(ctx.state.userSession);
  ctx.status = 200;
  ctx.body = { status: 200, credentials };
}

async function setConfig(ctx) {
  const isSuperAdmin = await leemons
    .getPlugin('users')
    .services.users.isSuperAdmin(ctx.state.userSession.id);

  if (isSuperAdmin) {
    const config = await socketService.setConfig(ctx.request.body);
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

async function getConfig(ctx) {
  const isSuperAdmin = await leemons
    .getPlugin('users')
    .services.users.isSuperAdmin(ctx.state.userSession.id);

  if (isSuperAdmin) {
    const config = await socketService.getConfig(ctx.request.body);
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
  getCredentials,
  setConfig,
  getConfig,
};
