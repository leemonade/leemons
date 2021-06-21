const { table } = require('../tables');

async function existPermissionAction(permissionName, actionName, transacting) {
  const response = await table.permissionAction.count(
    {
      permissionName,
      actionName,
    },
    { transacting }
  );
  return !!response;
}

module.exports = { existPermissionAction };
