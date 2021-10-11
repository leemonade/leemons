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
const { getUserAgentPermissions } = require('./getUserAgentPermissions');
const { userAgentHasCustomPermission } = require('./userAgentHasCustomPermission');
const { findUserAgentsWithPermission } = require('./findUserAgentsWithPermission');
const { manyPermissionsHasManyActions } = require('./manyPermissionsHasManyActions');
const { addCustomPermissionToUserAgent } = require('./addCustomPermissionToUserAgent');
const {
  removeCustomPermissionForAllUserAgents,
} = require('./removeCustomPermissionForAllUserAgents');

module.exports = {
  add,
  list,
  init,
  exist,
  update,
  remove,
  addMany,
  addAction,
  existMany,
  hasAction,
  updateMany,
  removeMany,
  addActionMany,
  hasActionMany,
  getUserAgentPermissions,
  userAgentHasCustomPermission,
  findUserAgentsWithPermission,
  manyPermissionsHasManyActions,
  addCustomPermissionToUserAgent,
  removeCustomPermissionForAllUserAgents,
};
