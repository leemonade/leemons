const { deleteById } = require('./deleteById');
const { existUserAgent } = require('./existUserAgent');
const { searchUserAgents } = require('./searchUserAgents');
const { getUserAgentsInfo } = require('./getUserAgentsInfo');
const { getUserAgentCenter } = require('./getUserAgentCenter');
const { agentDetailForPage } = require('./agentDetailForPage');
const { getUserAgentByCenterProfile } = require('./getUserAgentByCenterProfile');

// Calendars
const { getUserAgentCalendarKey } = require('./calendar/getUserAgentCalendarKey');
const {
  addCalendarToUserAgentsIfNeedByUser,
} = require('./calendar/addCalendarToUserAgentsIfNeedByUser');

// Contacts
const { addUserAgentContacts } = require('./contacts/addUserAgentContacts');
const { getUserAgentContacts } = require('./contacts/getUserAgentContacts');
const { removeUserAgentContacts } = require('./contacts/removeUserAgentContacts');

// Permissions
const { userAgentHasPermission } = require('./permissions/userAgentHasPermission');
const { getUserAgentPermissions } = require('./permissions/getUserAgentPermissions');
const { updateUserAgentPermissions } = require('./permissions/updateUserAgentPermissions');
const { userAgentHasCustomPermission } = require('./permissions/userAgentHasCustomPermission');
const { addCustomPermissionToUserAgent } = require('./permissions/addCustomPermissionToUserAgent');
const {
  removeCustomUserAgentPermission,
} = require('./permissions/removeCustomUserAgentPermission');

// Item permissions
const { getBaseAllPermissionsQuery } = require('./item-permissions/getBaseAllPermissionsQuery');
const { userAgentHasPermissionToItem } = require('./item-permissions/userAgentHasPermissionToItem');
const {
  getAllItemsForTheUserAgentHasPermissions,
} = require('./item-permissions/getAllItemsForTheUserAgentHasPermissions');
const {
  getAllItemsForTheUserAgentHasPermissionsByType,
} = require('./item-permissions/getAllItemsForTheUserAgentHasPermissionsByType');
const { filterUserAgentsByProfileAndCenter } = require('./filterUserAgentsByProfileAndCenter');
const { getDataForUserAgentDatasets } = require('./getDataForUserAgentDatasets');
const { saveDataForUserAgentDatasets } = require('./saveDataForUserAgentDatasets');
const { update } = require('./update');
const { disable } = require('./disable');
const { active } = require('./active');
const { userAgentsAreContacts } = require('./contacts/userAgentsAreContacts');

module.exports = {
  update,
  active,
  disable,
  deleteById,
  existUserAgent,
  searchUserAgents,
  getUserAgentsInfo,
  getUserAgentCenter,
  agentDetailForPage,
  getDataForUserAgentDatasets,
  saveDataForUserAgentDatasets,
  getUserAgentByCenterProfile,
  filterUserAgentsByProfileAndCenter,
  calendars: {
    getUserAgentCalendarKey,
    addCalendarToUserAgentsIfNeedByUser,
  },
  contacts: {
    userAgentsAreContacts,
    addUserAgentContacts,
    getUserAgentContacts,
    removeUserAgentContacts,
  },
  permissions: {
    userAgentHasPermission,
    getUserAgentPermissions,
    updateUserAgentPermissions,
    userAgentHasCustomPermission,
    addCustomPermissionToUserAgent,
    removeCustomUserAgentPermission,
  },
  itemPermissions: {
    getBaseAllPermissionsQuery,
    userAgentHasPermissionToItem,
    getAllItemsForTheUserAgentHasPermissions,
    getAllItemsForTheUserAgentHasPermissionsByType,
  },
};
