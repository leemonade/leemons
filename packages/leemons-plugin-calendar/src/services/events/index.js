const { add } = require('./add');
const { exist } = require('./exist');
const { remove } = require('./remove');
const { update } = require('./update');
const { detail } = require('./detail');
const { addFromUser } = require('./addFromUser');
const { removeOrCancel } = require('./removeOrCancel');
const { removeFromUser } = require('./removeFromUser');
const { updateFromUser } = require('./updateFromUser');
const { getPermissionConfig } = require('./getPermissionConfig');
const { grantAccessUserAgentToEvent } = require('./grantAccessUserAgentToEvent');
const { unGrantAccessUserAgentToEvent } = require('./unGrantAccessUserAgentToEvent');
const { updateEventSubTasksFromUser } = require('./updateEventSubTasksFromUser');

module.exports = {
  add,
  exist,
  remove,
  detail,
  update,
  addFromUser,
  removeOrCancel,
  removeFromUser,
  updateFromUser,
  getPermissionConfig,
  grantAccessUserAgentToEvent,
  updateEventSubTasksFromUser,
  unGrantAccessUserAgentToEvent,
};
