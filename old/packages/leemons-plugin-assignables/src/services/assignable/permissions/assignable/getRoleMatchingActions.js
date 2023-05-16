const _ = require('lodash');

module.exports = function getRoleMatchingActions(actions) {
  let { assignableRolesObject } = leemons.plugin.config.constants;

  assignableRolesObject = Object.entries(assignableRolesObject);

  const { length } = assignableRolesObject;

  for (let i = 0; i < length; i++) {
    const [name, role] = assignableRolesObject[i];

    const { actions: roleActions } = role;

    if (_.isEqual(actions.sort(), roleActions.sort())) {
      return name;
    }
  }

  return null;
};
