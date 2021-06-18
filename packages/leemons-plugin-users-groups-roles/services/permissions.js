const permissions = require('./private/permissions');

module.exports = {
  add: permissions.add,
  addMany: permissions.addMany,
  update: permissions.update,
  updateMany: permissions.updateMany,
  delete: permissions.remove,
  deleteMany: permissions.removeMany,
  exist: permissions.exist,
  existMany: permissions.existMany,
  hasAction: permissions.hasAction,
  hasActionMany: permissions.hasActionMany,
  manyPermissionsHasManyActions: permissions.manyPermissionsHasManyActions,
  existPermissionAction: permissions.existPermissionAction,
  addActionMany: permissions.addActionMany,
  addAction: permissions.addAction,
};
