const { uniq, map, groupBy, difference, pick, entries } = require('lodash');

const { getRoleMatchingActions } = require('../../helpers/getRoleMatchingActions');
const { getTeacherPermissions } = require('../getTeacherPermissions');

const { assignableActions } = require('../../../../../config/constants');

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

  const assetsPermissions = await ctx.tx.call('leebrary.permissions.getByAssets', {
    assets: assetsIds,
    showPublic: true,
    ctx,
  });

  const directPermissions = Object.fromEntries(
    assetsPermissions.flatMap(({ asset, permissions }) => {
      const actions = entries(pick(permissions, assignableActions))
        .filter(([, value]) => !!value)
        .map(([action]) => action);
      return assignablesByAsset[asset].map(({ id }) => [id, actions]);
    })
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
