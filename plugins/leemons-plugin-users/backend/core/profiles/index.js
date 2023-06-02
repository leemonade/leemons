const { add } = require('./add');
const { list } = require('./list');
const { update } = require('./update');
const { existMany } = require('./existMany');
const { existName } = require('./existName');
const { detailByUri } = require('./detailByUri');
const { getProfileSysName } = require('./getProfileSysName');
const { addCustomPermissions } = require('./permissions/addCustomPermissions');
const { addAllPermissionsToAllProfiles } = require('./addAllPermissionsToAllProfiles');
const { removeCustomPermissionsByName } = require('./permissions/removeCustomPermissionsByName');
const { getRoleForRelationshipProfileCenter } = require('./getRoleForRelationshipProfileCenter');

// Contacts
const { addProfileContact } = require('./contacts/addProfileContact');
const { getProfileContacts } = require('./contacts/getProfileContacts');
const { detailBySysName } = require('./detailBySysName');
const { saveBySysName } = require('./saveBySysName');

module.exports = {
  add,
  list,
  update,
  existMany,
  existName,
  detailByUri,
  saveBySysName,
  detailBySysName,
  getProfileSysName,
  addProfileContact,
  getProfileContacts,
  addCustomPermissions,
  removeCustomPermissionsByName,
  addAllPermissionsToAllProfiles,
  getRoleForRelationshipProfileCenter,
};
