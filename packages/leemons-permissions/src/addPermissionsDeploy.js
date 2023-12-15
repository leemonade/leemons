const { hasKey, setKey } = require('@leemons/mongodb-helpers');

async function addPermissionsDeploy({ keyValueModel, permissions, ctx }) {
  const startTime = new Date();
  const hasKeyStartTime = new Date();
  if (!(await hasKey(keyValueModel, `permissions`))) {
    // console.log('Has Key Permissions: ' + (new Date() - hasKeyStartTime) + 'ms');
    const addManyStartTime = new Date();
    await ctx.tx.call('users.permissions.addMany', permissions);
    // console.log('users.permissions.addMany: ' + (new Date() - addManyStartTime) + 'ms');
    const keyValueModelStartTime = new Date();
    await setKey(keyValueModel, `permissions`);
    // console.log('keyValueModel: ' + (new Date() - keyValueModelStartTime) + 'ms');
  }
  ctx.tx.emit('init-permissions');
  // console.log('Create Permissions: ' + (new Date() - startTime) + 'ms');
}

module.exports = { addPermissionsDeploy };
