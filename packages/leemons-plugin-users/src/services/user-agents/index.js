const { existUserAgent } = require('./existUserAgent');
const { searchUserAgents } = require('./searchUserAgents');
const { getUserAgentsInfo } = require('./getUserAgentsInfo');
const { getUserAgentCenter } = require('./getUserAgentCenter');

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
const { getDataForUserAgentDatasets } = require('./getDataForUserAgentDatasets');
const { saveDataForUserAgentDatasets } = require('./saveDataForUserAgentDatasets');

module.exports = {
  existUserAgent,
  searchUserAgents,
  getUserAgentsInfo,
  getUserAgentCenter,
  getDataForUserAgentDatasets,
  saveDataForUserAgentDatasets,
  calendars: {
    getUserAgentCalendarKey,
    addCalendarToUserAgentsIfNeedByUser,
  },
  contacts: {
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
