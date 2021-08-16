const { list } = require('./list');
const { add } = require('./add');
const { existName } = require('./existName');
const { detailByUri } = require('./detailByUri');
const { update } = require('./update');
const existMany = require('./existMany');
const addCustomPermissions = require('./addCustomPermissions');
const removeCustomPermissionsByName = require('./removeCustomPermissionsByName');
const { getRoleForRelationshipProfileCenter } = require('./getRoleForRelationshipProfileCenter');

module.exports = {
  list,
  add,
  existName,
  detailByUri,
  update,
  existMany,
  addCustomPermissions,
  removeCustomPermissionsByName,
  getRoleForRelationshipProfileCenter,
};
