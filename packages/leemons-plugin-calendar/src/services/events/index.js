const { add } = require('./add');
const { exist } = require('./exist');
const { detail } = require('./detail');
const { addFromUser } = require('./addFromUser');
const { removeOrCancel } = require('./removeOrCancel');
const { removeFromUser } = require('./removeFromUser');
const { getPermissionConfig } = require('./getPermissionConfig');
const { grantAccessUserAgentToEvent } = require('./grantAccessUserAgentToEvent');
const { unGrantAccessUserAgentToEvent } = require('./unGrantAccessUserAgentToEvent');

module.exports = {
  add,
  exist,
  detail,
  addFromUser,
  removeOrCancel,
  removeFromUser,
  getPermissionConfig,
  grantAccessUserAgentToEvent,
  unGrantAccessUserAgentToEvent,
};
