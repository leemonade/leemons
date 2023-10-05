const { hasKey, setKey } = require('@leemons/mongodb-helpers');

async function addPermissionsDeploy({ keyValueModel, permissions, ctx }) {
  console.time('Create Permissions');
  console.time('Has Key Permissions');
  if (!(await hasKey(keyValueModel, `permissions`))) {
    console.timeEnd('Has Key Permissions');
    console.time('users.permissions.addMany');
    await ctx.tx.call('users.permissions.addMany', permissions);
    console.timeEnd('users.permissions.addMany');
    console.time('keyValueModel');
    await setKey(keyValueModel, `permissions`);
    console.timeEnd('keyValueModel');
  }
  ctx.tx.emit('init-permissions');
  console.timeEnd('Create Permissions');
}

module.exports = { addPermissionsDeploy };
