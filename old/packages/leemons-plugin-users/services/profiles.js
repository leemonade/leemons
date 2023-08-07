const profiles = require('../src/services/profiles');

// TODO Solo deberian de tener acceso los plugins que tengan permiso a ejecutar dichas funciones o los usuarios con permiso
module.exports = {
  add: profiles.add,
  list: profiles.list,
  update: profiles.update,
  existName: profiles.existName,
  existMany: profiles.existMany,
  detailByUri: profiles.detailByUri,
  saveBySysName: profiles.saveBySysName,
  detailBySysName: profiles.detailBySysName,
  getProfileSysName: profiles.getProfileSysName,
  // TODO Comprobar acceso
  addProfileContact: profiles.addProfileContact,
  getProfileContacts: profiles.getProfileContacts,
  addCustomPermissions: profiles.addCustomPermissions,
  removeCustomPermissionsByName: profiles.removeCustomPermissionsByName,
  getRoleForRelationshipProfileCenter: profiles.getRoleForRelationshipProfileCenter,
};
