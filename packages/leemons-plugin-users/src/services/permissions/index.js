const { add } = require('./add');
const { list } = require('./list');
const { init } = require('./init');
const { exist } = require('./exist');
const { update } = require('./update');
const { remove } = require('./remove');
const { addMany } = require('./addMany');
const { addAction } = require('./addAction');
const { existMany } = require('./existMany');
const { hasAction } = require('./hasAction');
const { updateMany } = require('./updateMany');
const { removeMany } = require('./removeMany');
const { addActionMany } = require('./addActionMany');
const { hasActionMany } = require('./hasActionMany');
const { findUsersWithPermissions } = require('./findUsersWithPermissions');
const { findUserAgentsWithPermission } = require('./findUserAgentsWithPermission');
const { manyPermissionsHasManyActions } = require('./manyPermissionsHasManyActions');

const {
  removeCustomPermissionForAllUserAgents,
} = require('./removeCustomPermissionForAllUserAgents');
const { getUserAgentPermissions } = require('../user-agents/permissions/getUserAgentPermissions');
const {
  userAgentHasCustomPermission,
} = require('../user-agents/permissions/userAgentHasCustomPermission');
const {
  addCustomPermissionToUserAgent,
} = require('../user-agents/permissions/addCustomPermissionToUserAgent');

module.exports = {
  add,
  init,
  list,
  exist,
  update,
  remove,
  addMany,
  existMany,
  addAction,
  hasAction,
  updateMany,
  removeMany,
  addActionMany,
  hasActionMany,
  getUserAgentPermissions,
  findUsersWithPermissions,
  userAgentHasCustomPermission,
  findUserAgentsWithPermission,
  manyPermissionsHasManyActions,
  addCustomPermissionToUserAgent,
  removeCustomPermissionForAllUserAgents,
};
