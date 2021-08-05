const profiles = require('../src/services/profiles');

// TODO Solo deberian de tener acceso los plugins que tengan permiso a ejecutar dichas funciones o los usuarios con permiso
module.exports = {
  add: profiles.add,
  existName: profiles.existName,
  update: profiles.update,
  list: profiles.list,
  detailByUri: profiles.detailByUri,
  addCustomPermissions: profiles.addCustomPermissions,
  removeCustomPermissionsByName: profiles.removeCustomPermissionsByName,
  getRoleForRelationshipProfileCenter: profiles.getRoleForRelationshipProfileCenter,
};
