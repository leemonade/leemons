const importUsers = require('./bulk/users');

async function initAdmin({ file, ctx }) {
  const users = await importUsers(file, {}, {});
  await ctx.call('admin.settings.registerAdmin', {
    ...users.super,
  });

  await ctx.call('admin.settings.update', {
    status: 'INSTALLED',
    configured: true,
  });
}

module.exports = initAdmin;
