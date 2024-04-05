const _ = require('lodash');
const {
  checkIfCanCreateNUserAgentsInRoleProfiles,
} = require('../users/checkIfCanCreateNUserAgentsInRoleProfiles');
const {
  checkIfCanCreateUserAgentInGroup,
} = require('../groups/checkIfCanCreateNUserAgentsInGroup');

/**
 * Activates a user agent by setting its `disabled` flag to `false`. This process involves several checks
 * related to the user agent's roles and groups to ensure compliance with role-related constraints and rules.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.id - The ID of the user agent to be activated.
 * @param {Object} params.ctx - The context object, which includes the database transaction context.
 * @returns {Promise<Object>} - The updated user agent object with `disabled` set to `false`.
 *
 * Steps:
 * 1. Retrieves the user agent by its `id` and all groups associated with this user agent.
 * 2. Filters out groups that are of type 'role', identifying those that represent roles within the system.
 * 3. Performs checks to ensure activating this user agent does not violate:
 *    a. Constraints related to the number of user agents that can be active within a given role profile.
 *    b. Any limitations or rules specific to groups (roles) the user agent is part of.
 * 4. If all checks pass, updates the user agent's `disabled` flag to `false`, effectively activating it.
 *
 * Relation to "Roles":
 * - The function is closely related to "roles" as it involves identifying groups that represent roles and
 *   ensuring that activating a user agent complies with role-related constraints and rules, both at the profile
 *   and group levels. This ensures that the activation of a user agent is consistent with the platform's access
 *   control and role management policies.
 */
async function active({ id, ctx }) {
  const [userAgent, groups] = await Promise.all([
    ctx.tx.db.UserAgent.findOne({ id }).lean(),
    ctx.tx.db.GroupUserAgent.find({ userAgent: id }).select(['id']).lean(),
  ]);
  // From all the groups the user is in, we will determine which ones are of type 'role'
  const roleGroups = await ctx.tx.db.Groups.find({ type: 'role', id: _.map(groups, 'id') })
    .select(['id'])
    .lean();

  await Promise.all([
    checkIfCanCreateNUserAgentsInRoleProfiles({ nUserAgents: 1, role: userAgent.role, ctx }),
    Promise.all(
      _.map(roleGroups, (group) =>
        checkIfCanCreateUserAgentInGroup({ userAgentId: id, groupId: group.id, ctx })
      )
    ),
  ]);
  return ctx.tx.db.UserAgent.findOneAndUpdate(
    { id },
    { disabled: false },
    { new: true, lean: true }
  );
}

module.exports = {
  active,
};
