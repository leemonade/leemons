const { add } = require('./add');
const { init } = require('./init');
const { list } = require('./list');
const { exist } = require('./exist');
const { update } = require('./update');
const { remove } = require('./remove');
const { addMany } = require('./addMany');
const { existMany } = require('./existMany');
const { hasAction } = require('./hasAction');
const { addAction } = require('./addAction');
const { updateMany } = require('./updateMany');
const { removeMany } = require('./removeMany');
const { addActionMany } = require('./addActionMany');
const { hasActionMany } = require('./hasActionMany');
const { findUserAgentsWithPermission } = require('./findUserAgentsWithPermission');
const { manyPermissionsHasManyActions } = require('./manyPermissionsHasManyActions');
const { getUserAgentPermissions } = require('../user-agents/permissions/getUserAgentPermissions');
const {
  addCustomPermissionToUserAgent,
} = require('../user-agents/permissions/addCustomPermissionToUserAgent');
const {
  userAgentHasCustomPermission,
} = require('../user-agents/permissions/userAgentHasCustomPermission');

module.exports = {
  add,
  init,
  list,
  exist,
  remove,
  update,
  addMany,
  existMany,
  addAction,
  hasAction,
  removeMany,
  updateMany,
  addActionMany,
  hasActionMany,
  getUserAgentPermissions,
  userAgentHasCustomPermission,
  findUserAgentsWithPermission,
  manyPermissionsHasManyActions,
  addCustomPermissionToUserAgent,
};
