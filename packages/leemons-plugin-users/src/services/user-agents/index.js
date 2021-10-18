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
const { updateUserAgentPermissions } = require('./permissions/updateUserAgentPermissions');
const {
  removeCustomUserAgentPermission,
} = require('./permissions/removeCustomUserAgentPermission');

module.exports = {
  existUserAgent,
  searchUserAgents,
  getUserAgentsInfo,
  getUserAgentCenter,
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
    updateUserAgentPermissions,
    removeCustomUserAgentPermission,
  },
};
