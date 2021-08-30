const { list } = require('./list');
const { existMany } = require('./existMany');
const { exist } = require('./exist');
const { updateMany } = require('./updateMany');
const { update } = require('./update');
const { removeMany } = require('./removeMany');
const { remove } = require('./remove');
const { manyPermissionsHasManyActions } = require('./manyPermissionsHasManyActions');
const { hasActionMany } = require('./hasActionMany');
const { hasAction } = require('./hasAction');
const { addMany } = require('./addMany');
const { addActionMany } = require('./addActionMany');
const { addAction } = require('./addAction');
const { add } = require('./add');
const { init } = require('./init');
const { addCustomPermissionToUserAgent } = require('./addCustomPermissionToUserAgent');
const { getUserAgentPermissions } = require('./getUserAgentPermissions');
const { userAgentHasCustomPermission } = require('./userAgentHasCustomPermission');

module.exports = {
  init,
  list,
  exist,
  existMany,
  add,
  addMany,
  addAction,
  addActionMany,
  remove,
  removeMany,
  update,
  updateMany,
  hasAction,
  hasActionMany,
  manyPermissionsHasManyActions,
  addCustomPermissionToUserAgent,
  getUserAgentPermissions,
  userAgentHasCustomPermission,
};
