const itemPermissions = require('../src/services/item-permissions');

module.exports = {
  add: itemPermissions.add,
  addMany: itemPermissions.addMany,
  find: itemPermissions.find,
  remove: itemPermissions.remove,
  exist: itemPermissions.exist,
  count: itemPermissions.count,
};
