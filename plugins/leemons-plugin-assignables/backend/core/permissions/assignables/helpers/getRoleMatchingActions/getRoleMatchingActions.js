/**
 * Get role matching actions
 * @function getRoleMatchingActions
 * @param {Object} params - The main parameter object.
 * @param {Array<string>} params.actions - The actions to match.
 * @returns {string|null} The name of the role that matches the actions, or null if no match is found.
 */
const { isEqual } = require('lodash');
const { assignableRolesObject } = require('../../../../../config/constants');

function getRoleMatchingActions({ actions }) {
  const assignableRolesEntries = Object.entries(assignableRolesObject);

  const { length } = assignableRolesEntries;
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
