const { add } = require('./add');
const { list } = require('./list');
const { update } = require('./update');
const { existMany } = require('./existMany');
const { existName } = require('./existName');
const { detailByUri } = require('./detailByUri');
const { addCustomPermissions } = require('./permissions/addCustomPermissions');
const { removeCustomPermissionsByName } = require('./permissions/removeCustomPermissionsByName');
const { getRoleForRelationshipProfileCenter } = require('./getRoleForRelationshipProfileCenter');

module.exports = {
  add,
  list,
  update,
  existMany,
  existName,
  detailByUri,
  addCustomPermissions,
  removeCustomPermissionsByName,
  getRoleForRelationshipProfileCenter,
};
