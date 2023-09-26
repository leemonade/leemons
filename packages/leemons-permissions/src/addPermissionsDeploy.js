const { hasKey, setKey } = require('@leemons/mongodb-helpers');

async function addPermissionsDeploy({ keyValueModel, permissions, ctx }) {
  console.log('addPermissionsDeploy fuera');
  if (!(await hasKey(keyValueModel, `permissions`))) {
    console.log('addPermissionsDeploy dentro');
    await ctx.tx.call('users.permissions.addMany', permissions);
    console.log('addPermissionsDeploy BIEN');
    await setKey(keyValueModel, `permissions`);
  }
  ctx.tx.emit('init-permissions');
}

module.exports = { addPermissionsDeploy };
