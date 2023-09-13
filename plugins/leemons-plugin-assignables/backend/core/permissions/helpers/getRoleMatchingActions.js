const { isEqual } = require('lodash');
const { assignableRolesObject } = require('../../../config/constants');

function getRoleMatchingActions({ actions }) {
  const assignableRolesEntries = Object.entries(assignableRolesObject);

  const { length } = assignableRolesObject;

  for (let i = 0; i < length; i++) {
    const [name, role] = assignableRolesEntries[i];

    const { actions: roleActions } = role;

    if (isEqual(actions.sort(), roleActions.sort())) {
      return name;
    }
  }

  return null;
}

module.exports = { getRoleMatchingActions };
