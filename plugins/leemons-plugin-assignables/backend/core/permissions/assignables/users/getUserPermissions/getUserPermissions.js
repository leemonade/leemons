const { escapeRegExp, uniq, map, groupBy, difference } = require('lodash');

const { getRoleMatchingActions } = require('../../../assignables/helpers/getRoleMatchingActions');
const { getPermissionName } = require('../../../assignables/helpers/getPermissionName');
const { getTeacherPermissions } = require('../getTeacherPermissions');

const { getParentPermissions } = require('./getParentPermissions');

/**
 * Retrieves the user permissions based on the given assignables and context.
 *
 * @param {Object} options - The options for retrieving user permissions.
 * @param {Array} options.assignables - The list of assignables.
 * @param {MoleculerContext} options.ctx - The Moleculer context.
 * @return {Promise<Object>} A promise that resolves to an object containing the user permissions.
 */
async function getUserPermissions({ assignables, ctx }) {
  const assignablesIds = uniq(map(assignables, 'id'));
  const assetsIds = uniq(map(assignables, 'asset'));
  const assignablesByAsset = groupBy(assignables, 'asset');

  if (!ctx.meta.userSession.userAgents.length) {
    return Object.fromEntries(
      assignablesIds.map((id) => [
        id,
        { role: getRoleMatchingActions({ actions: [] }), actions: [] },
      ])
    );
  }

  const query = {
    $or: assignablesIds.map((id) => ({
      permissionName: { $regex: escapeRegExp(new RegExp(getPermissionName({ id, ctx }), 'i')) },
    })),
  };

  const [permissions, canAssignPerms, parentPermissions] = await Promise.all([
    ctx.tx.call('users.permissions.getUserAgentPermissions', {
      userAgent: ctx.meta.userSession.userAgents,
      query,
    }),
    ctx.tx.call('users.permissions.getAllItemsForTheUserAgentHasPermissionsByType', {
      userAgentId: map(ctx.meta.userSession.userAgents, 'id'),
      type: 'leebrary.asset.can-assign',
      ignoreOriginalTarget: true,
      item: assetsIds,
    }),
    getParentPermissions({ ids: assignablesIds, ctx }),
  ]);

  const directPermissions = Object.fromEntries(
    permissions
      .map(({ permissionName, actionNames }) => [
        /\.assignable\.(?<id>[^@]+@(\d+\.){2}\d+)/.exec(permissionName).groups.id,
        actionNames,
      ])
      .concat(
        canAssignPerms.flatMap((id) =>
          assignablesByAsset[id].map(({ id: assignableId }) => [assignableId, ['view']])
        )
      )
      .concat(parentPermissions)
  );

  const assignablesWithoutPermissions = difference(assignablesIds, Object.keys(directPermissions));

  if (!assignablesWithoutPermissions.length) {
    return Object.fromEntries(
      assignablesIds.map((id) => [
        id,
        {
          role: getRoleMatchingActions({ actions: directPermissions[id] || [] }),
          actions: directPermissions[id] || [],
        },
      ])
    );
  }

  const teacherPermissions = await getTeacherPermissions({ assignableIds: assignablesIds, ctx });

  return Object.fromEntries(
    assignablesIds.map((id) => {
      let actions = [];

      if (directPermissions[id]) {
        actions = directPermissions[id];
      } else if (teacherPermissions[id]) {
        actions = ['edit', 'view', 'assign']; // Teacher actions
      }

      return [
        id,
        {
          role: getRoleMatchingActions({ actions }),
          actions,
        },
      ];
    })
  );
}

module.exports = { getUserPermissions };
