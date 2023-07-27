const { hasKey, setKey } = require('leemons-mongodb-helpers');

async function addPermissionsDeploy({ keyValueModel, permissions, ctx }) {
  if (!(await hasKey(keyValueModel, `permissions`))) {
    await ctx.tx.call('users.permissions.addMany', permissions);
    await setKey(keyValueModel, `permissions`);
  }
  ctx.tx.emit('init-permissions');
}

module.exports = { addPermissionsDeploy };
