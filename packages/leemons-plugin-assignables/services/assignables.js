const createAssignable = require('../src/services/assignable/createAssignable');
const getAssignable = require('../src/services/assignable/getAssignable');
const publishAssignable = require('../src/services/assignable/publishAssignable');
const removeAssignable = require('../src/services/assignable/removeAssignable');
const updateAssignable = require('../src/services/assignable/updateAssignable');
const getRole = require('../src/services/roles/getRole');
const registerRole = require('../src/services/roles/registerRole');
const unregisterRole = require('../src/services/roles/unregisterRole');

function createAssignableService(assignable, { userSession, transacting }) {
  return createAssignable.call(this, assignable, { userSession, transacting });
}

module.exports = {
  // Assignables
  createAssignable: createAssignableService,
  getAssignable,
  updateAssignable,
  removeAssignable,
  publishAssignable,

  // Roles
  registerRole,
  unregisterRole,
  getRole,
};
