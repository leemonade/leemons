const { active } = require('./active');
const {
  addCenterAssetsPermissionToCenterAdminUserAgent,
} = require('./addCenterAssetsPermissionToCenterAdminUserAgent');
const { agentDetailForPage } = require('./agentDetailForPage');

// Calendars
const {
  addCalendarToUserAgentsIfNeedByUser,
} = require('./calendar/addCalendarToUserAgentsIfNeedByUser');

// Contacts
const { addUserAgentContacts } = require('./contacts/addUserAgentContacts');
const { getUserAgentContacts } = require('./contacts/getUserAgentContacts');
const { removeUserAgentContacts } = require('./contacts/removeUserAgentContacts');

// Permissions

// Item permissions
const { userAgentsAreContacts } = require('./contacts/userAgentsAreContacts');
const { deleteById } = require('./deleteById');
const { disable } = require('./disable');
const { existUserAgent } = require('./existUserAgent');
const { filterUserAgentsByProfileAndCenter } = require('./filterUserAgentsByProfileAndCenter');
const {
  getActiveUserAgentsCountByProfileSysName,
} = require('./getActiveUserAgentsCountByProfileSysName');
const { getDataForUserAgentDatasets } = require('./getDataForUserAgentDatasets');
const { getUserAgentByCenterProfile } = require('./getUserAgentByCenterProfile');
const { getUserAgentCenter } = require('./getUserAgentCenter');
const { getUserAgentsInfo } = require('./getUserAgentsInfo');
const {
  getAllItemsForTheUserAgentHasPermissions,
} = require('./item-permissions/getAllItemsForTheUserAgentHasPermissions');
const {
  getAllItemsForTheUserAgentHasPermissionsByType,
} = require('./item-permissions/getAllItemsForTheUserAgentHasPermissionsByType');
const { getBaseAllPermissionsQuery } = require('./item-permissions/getBaseAllPermissionsQuery');
const { userAgentHasPermissionToItem } = require('./item-permissions/userAgentHasPermissionToItem');
const { addCustomPermissionToUserAgent } = require('./permissions/addCustomPermissionToUserAgent');
const { getUserAgentPermissions } = require('./permissions/getUserAgentPermissions');
const {
  removeCustomUserAgentPermission,
} = require('./permissions/removeCustomUserAgentPermission');
const { updateUserAgentPermissions } = require('./permissions/updateUserAgentPermissions');
const { userAgentHasCustomPermission } = require('./permissions/userAgentHasCustomPermission');
const { userAgentHasPermission } = require('./permissions/userAgentHasPermission');
const { saveDataForUserAgentDatasets } = require('./saveDataForUserAgentDatasets');
const { searchUserAgents } = require('./searchUserAgents');
const { update } = require('./update');

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
  getActiveUserAgentsCountByProfileSysName,
  calendars: {
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
    addCenterAssetsPermissionToCenterAdminUserAgent,
  },
  itemPermissions: {
    getBaseAllPermissionsQuery,
    userAgentHasPermissionToItem,
    getAllItemsForTheUserAgentHasPermissions,
    getAllItemsForTheUserAgentHasPermissionsByType,
  },
};
