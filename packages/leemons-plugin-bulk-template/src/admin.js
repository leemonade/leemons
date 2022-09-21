const importUsers = require('./bulk/users');

async function initAdmin() {
  const { services } = leemons.getPlugin('admin');

  const users = await importUsers({}, {});

  await services.settings.registerAdmin(users.super);
  await services.settings.update({ status: 'INSTALLED', configured: true });
}

module.exports = initAdmin;
