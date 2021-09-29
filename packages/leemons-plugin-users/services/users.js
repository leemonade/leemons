const _ = require('lodash');
const usersService = require('../src/services/users');
const { table } = require('../src/services/tables');

module.exports = {
  detail: async (userId, { transacting } = {}) => {
    const users = await usersService.detail(userId, { transacting });
    const response = [];
    _.forEach(_.isArray(users) ? users : [users], ({ id, email, name, surnames, created_at }) => {
      response.push({ id, email, name, surnames, created_at });
    });
    return _.isArray(users) ? response : response[0];
  },
  isSuperAdmin: usersService.isSuperAdmin,
  detailForJWT: usersService.detailForJWT,
  getUserAgentCenter: usersService.getUserAgentCenter,
  hasPermissionCTX: usersService.hasPermissionCTX,
  // TODO Solo deberian de tener acceso los plugins que tengan permiso a ejecutar dichas funciones o los usuarios con permiso
  add: usersService.add,
  searchUserAgents: usersService.searchUserAgents,
  // TODO Pensar si los plugins deberian de solicitar permiso o si darle acceso siempre
  removeCustomPermission: usersService.removeCustomPermission,
  hasPermission: usersService.hasPermission,
  addMenuItemCustomForUserWithProfile: async (userId, profileId, data, { transacting }) => {
    // TODO Esto esta mal por que los items añadidos no quedan vinculados para siempre por que si le quitan de un centro y le añaden en otro al ese user agent que tenia vinculado
    // el permiso ya no existe
    const [user, profileRoles] = await Promise.all([
      table.users.findOne({ id: userId }, { transacting }),
      table.profileRole.find({ profile: profileId }, { transacting }),
    ]);

    const userAgents = await table.userAgent.find(
      {
        role_$in: _.map(profileRoles, 'role'),
        user: user.id,
      },
      { transacting }
    );
    return leemons.getPlugin('menu-builder').services.menuItem.addCustomForUser(
      {
        ...user,
        userAgents,
      },
      data,
      { transacting }
    );
  },
};
