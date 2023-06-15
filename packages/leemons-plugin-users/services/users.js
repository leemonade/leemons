const _ = require('lodash');
const usersService = require('../src/services/users');
const userAgentsService = require('../src/services/user-agents');
const userAgents = require('../src/services/user-agents');

module.exports = {
  detail: async (userId, { transacting } = {}) => {
    const users = await usersService.detail(userId, { transacting });
    const response = [];
    _.forEach(
      _.isArray(users) ? users : [users],
      ({ id, email, name, surnames, secondSurname, avatar, locale, created_at }) => {
        response.push({ id, email, name, surnames, secondSurname, avatar, locale, created_at });
      }
    );
    return _.isArray(users) ? response : response[0];
  },
  isSuperAdmin: usersService.isSuperAdmin,
  detailForJWT: usersService.jwt.detailForJWT,

  hasPermissionCTX: usersService.hasPermissionCTX,
  userSessionCheckUserAgentDatasets: usersService.userSessionCheckUserAgentDatasets,
  getUserCenters: usersService.centers,

  // TODO Solo deberian de tener acceso los plugins que tengan permiso a ejecutar dichas funciones o los usuarios con permiso
  add: usersService.add,
  addBulk: usersService.addBulk,
  updateEmail: usersService.updateEmail,
  updatePassword: usersService.updatePassword,

  // User agents
  searchUserAgents: userAgentsService.searchUserAgents,
  getUserAgentsInfo: userAgentsService.getUserAgentsInfo,
  getUserAgentCenter: userAgentsService.getUserAgentCenter,
  filterUserAgentsByProfileAndCenter: userAgentsService.filterUserAgentsByProfileAndCenter,
  getUserAgentByCenterProfile: userAgentsService.getUserAgentByCenterProfile,

  // Contacts
  userAgentsAreContacts: userAgentsService.contacts.userAgentsAreContacts,
  getUserAgentContacts: userAgentsService.contacts.getUserAgentContacts,
  addUserAgentContacts: userAgentsService.contacts.addUserAgentContacts,
  removeUserAgentContacts: userAgentsService.contacts.removeUserAgentContacts,

  // Calendar
  getUserAgentCalendarKey: userAgentsService.calendars.getUserAgentCalendarKey,

  // Permissions
  getUserAgentPermissions: userAgents.permissions.getUserAgentPermissions,
  userAgentHasPermission: userAgentsService.permissions.userAgentHasPermission,
  updateUserAgentPermissions: userAgents.permissions.updateUserAgentPermissions,
  userAgentHasCustomPermission: userAgents.permissions.userAgentHasCustomPermission,
  addCustomPermissionToUserAgent: userAgents.permissions.addCustomPermissionToUserAgent,
  removeCustomUserAgentPermission: userAgentsService.permissions.removeCustomUserAgentPermission,

  // Item permissions
  userAgentHasPermissionToItem: userAgents.itemPermissions.userAgentHasPermissionToItem,
  getAllItemsForTheUserAgentHasPermissions:
    userAgents.itemPermissions.getAllItemsForTheUserAgentHasPermissions,
  getAllItemsForTheUserAgentHasPermissionsByType:
    userAgents.itemPermissions.getAllItemsForTheUserAgentHasPermissionsByType,
  getUserFullName(userSession) {
    return `${userSession.name ? userSession.name : ''}${
      userSession.surnames ? ` ${userSession.surnames}` : ''
    }${userSession.secondSurname ? ` ${userSession.secondSurname}` : ''}`;
  },
};
