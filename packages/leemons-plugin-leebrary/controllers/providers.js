const { listProviders } = require('../src/services/providers/list');
const { setProviderConfig } = require('../src/services/settings/setProviderConfig');
const { setActiveProvider } = require('../src/services/settings/setActiveProvider');

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

async function setConfig(ctx) {
  const isSuperAdmin = await leemons
    .getPlugin('users')
    .services.users.isSuperAdmin(ctx.state.userSession.id);

  if (isSuperAdmin) {
    const providers = await setProviderConfig.call(
      { calledFrom: 'plugins.leebrary' },
      ctx.request.body.provider,
      ctx.request.body.config
    );
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

async function deleteConfig(ctx) {
  const isSuperAdmin = await leemons
    .getPlugin('users')
    .services.users.isSuperAdmin(ctx.state.userSession.id);

  if (isSuperAdmin) {
    const provider = leemons.getProvider(ctx.request.body.provider);
    await provider.services.provider.removeConfig();
    await await setActiveProvider(null);
    ctx.status = 200;
    ctx.body = {
      status: 200,
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
  setConfig,
  deleteConfig,
};
