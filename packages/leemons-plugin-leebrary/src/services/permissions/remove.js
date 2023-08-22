const { tables } = require('../tables');
const canUnassignRole = require('./helpers/canUnassignRole');
const getAssignerAndAssigneeRoles = require('./helpers/getAssignerAndAssigneeRoles');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Validates if the assigner can remove the role from assignee and removes the role if valid.
 * 
 * @param {string} assignerRole - The role of the assigner
 * @param {string} assigneeRole - The role of the assignee
 * @param {string} assetId - The ID of the asset
 * @param {string} assigneeAgent - The agent to be unassigned
 * @param {Object} options - An object containing transacting property
 * @returns {Promise} - Returns a promise that resolves when the role is removed
 * @throws {HttpError} - Throws an error if the assigner can't remove the role
 */
async function validateAndRemoveRole(assignerRole, assigneeRole, assetId, assigneeAgent, { transacting }) {
  if (!canUnassignRole(assignerRole, assigneeRole, null)) {
    throw new global.utils.HttpError(401, "You don't have permission to remove this role");
  }

  return await tables.permissions.deleteMany(
    {
      asset: assetId,
      userAgent: assigneeAgent,
    },
    { transacting }
  );
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Checks if the assigner can remove role from assignee and removes the role if possible.
 * 
 * @param {string} assetId - The ID of the asset
 * @param {string} assigneeAgent - The agent to be unassigned
 * @param {Object} options - An object containing userSession and transacting properties
 * @returns {Promise} - Returns a promise that resolves when the role is removed
 * @throws {HttpError} - Throws an error if the assigner can't remove the role or if there's a failure in deleting the role
 */
async function remove(assetId, assigneeAgent, { userSession, transacting } = {}) {
  try {
    const roles = await getAssignerAndAssigneeRoles(assetId, userSession, assigneeAgent, { transacting });
    return await validateAndRemoveRole(roles.assignerRole, roles.assigneeRole, assetId, assigneeAgent, { transacting });
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to delete role: ${e.message}`);
  }
}

module.exports = { remove };
