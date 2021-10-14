const profiles = require('../src/services/profiles');

// TODO Solo deberian de tener acceso los plugins que tengan permiso a ejecutar dichas funciones o los usuarios con permiso
module.exports = {
  add: profiles.add,
  list: profiles.list,
  update: profiles.update,
  existName: profiles.existName,
  detailByUri: profiles.detailByUri,
  addCustomPermissions: profiles.addCustomPermissions,
  removeCustomPermissionsByName: profiles.removeCustomPermissionsByName,
  getRoleForRelationshipProfileCenter: profiles.getRoleForRelationshipProfileCenter,
};
