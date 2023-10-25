const _ = require('lodash');

const constants = require('../../../../../config/constants');

function getRoleMatchingActions({ actions }) {
  let { assignableInstanceRolesObject } = constants;

  assignableInstanceRolesObject = Object.entries(assignableInstanceRolesObject);

  const { length } = assignableInstanceRolesObject;

  for (let i = 0; i < length; i++) {
    const [name, role] = assignableInstanceRolesObject[i];

    const { actions: roleActions } = role;

    if (_.isEqual(actions.sort(), roleActions.sort())) {
      return name;
    }
  }

  return null;
}

module.exports = { getRoleMatchingActions };
