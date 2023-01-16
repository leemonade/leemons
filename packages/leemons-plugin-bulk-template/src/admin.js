const importUsers = require('./bulk/users');

async function initAdmin(file) {
  const { services } = leemons.getPlugin('admin');

  const users = await importUsers(file, {}, {});

  await services.settings.registerAdmin(users.super);
  await services.settings.update({ status: 'INSTALLED', configured: true });
}

module.exports = initAdmin;
