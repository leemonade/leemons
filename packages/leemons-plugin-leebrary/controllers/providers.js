const { listProviders } = require('../src/services/providers/list');

async function list(ctx) {
  const isSuperAdmin = await leemons
    .getPlugin('users')
    .services.users.isSuperAdmin(ctx.state.userSession.id);

  if (isSuperAdmin) {
    const providers = await listProviders();
    ctx.status = 200;
    ctx.body = {
      status: 200,
      providers,
    };
  } else {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      message: 'Only can super admin',
    };
  }
}

module.exports = {
  list,
};
