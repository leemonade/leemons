const { uniq, map, groupBy, difference, pick, entries } = require('lodash');

const { escapeRegExp } = require('lodash');
const { getRoleMatchingActions } = require('../../helpers/getRoleMatchingActions');
const { getTeacherPermissions } = require('../getTeacherPermissions');

const { assignableActions } = require('../../../../../config/constants');
const { getPermissionName } = require('../../helpers');
const { getParentAssignables } = require('./getParentAssignables');

/**
 * Retrieves the parent permissions for a given set of IDs and context.
 *
 * @param {Object} options - The options for retrieving the parent permissions.
 * @param {Array} options.ids - The IDs for which to retrieve parent permissions.
 * @param {MoleculerContext} options.ctx - The Moleculer context.
 * @return {Promise<Object>} A promise that resolves to an object containing the parent permissions.
 */
async function getParentPermissions({ ids, ctx }) {
  const parents = await getParentAssignables({ ids, ctx });

  // eslint-disable-next-line no-use-before-define
  return getUserPermissions({ assignables: parents, ctx });
}

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

  if (!assignablesIds?.length) {
    return {};
  }

  if (!ctx.meta?.userSession?.userAgents?.length) {
    return Object.fromEntries(
      assignablesIds.map((id) => [
        id,
        { role: getRoleMatchingActions({ actions: [] }), actions: [] },
      ])
    );
  }

  const query = {
    $or: assignablesIds.map((id) => ({
      permissionName: { $regex: escapeRegExp(getPermissionName({ id, ctx })), $options: 'i' },
    })),
  };

  const [assignablePermissions, assetsPermissions, parentPermissions] = await Promise.all([
    ctx.tx.call('users.permissions.getUserAgentPermissions', {
      userAgent: ctx.meta.userSession.userAgents,
      query,
    }),
    ctx.tx.call('leebrary.permissions.getByAssets', {
      assets: assetsIds,
      showPublic: true,
      ctx,
    }),
    getParentPermissions({ ids: assignablesIds, ctx }),
  ]);

  const directPermissions = Object.fromEntries(
    // Get assignable permissions actions
    assignablePermissions
      .map(({ permissionName, actionNames }) => [
        /\.assignable\.(?<id>[^@]+@(\d+\.){2}\d+)/.exec(permissionName).groups.id,
        actionNames,
      ])
      // Get asset permissions actions
      .concat(
        assetsPermissions.flatMap(({ asset, permissions }) => {
          const actions = entries(pick(permissions, assignableActions))
            .filter(([, value]) => !!value)
            .map(([action]) => action);
          return assignablesByAsset[asset].map(({ id }) => [id, actions]);
        })
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
