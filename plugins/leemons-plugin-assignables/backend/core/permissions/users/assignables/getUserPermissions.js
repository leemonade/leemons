const { uniq, map, groupBy, uniqBy, pick, difference } = require('lodash');
const { getRoleMatchingActions } = require('../../assignables/helpers/getRoleMatchingActions');
const { getPermissionName } = require('../../assignables/helpers/getPermissionName');
const { getTeacherPermissions } = require('./getTeacherPermissions');

async function getParentAssignables({ ids, ctx }) {
  const parentAssignables = await ctx.tx.db
    .find({
      $or: ids.map((id) => ({
        submission: { $regex: new RegExp(`"activity":"${id}"`, 'i') },
      })),
    })
    .select({ asset: true, submission: true })
    .lean();

  return groupBy(
    parentAssignables.flatMap((parent) => {
      const submission = parent.submission ?? {};
      const activities = uniq(map(submission.activities, 'activity'));

      if (!activities.length) {
        return null;
      }

      return activities.map((activity) => ({
        asset: parent.asset,
        activity,
      }));
    })
  );
}

async function getParentPermissions({ ids, ctx }) {
  const parents = await getParentAssignables({ ids, ctx });
  const assetsIds = Object.keys(parents);
  const itemPermissions = await ctx.tx.call(
    'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType',
    {
      userAgentId: map(ctx.meta.userSession.userAgents, 'id'),
      type: 'leebrary.asset.can-assign',
      ignoreOriginalTarget: true,
      item: assetsIds,
    }
  );

  const activitiesWithPermissions = uniqBy(
    Object.values(pick(parents, itemPermissions)).flat(),
    'activity'
  );

  return activitiesWithPermissions.map(({ activity }) => [activity, ['view']]);
}

async function getUserPermissions({ assignables, ctx }) {
  const assignablesIds = uniq(map(assignables, 'id'));
  const assetsIds = uniq(map(assignables, 'asset'));
  const assignablesByAsset = groupBy(assignables, 'asset');

  if (!ctx.meta.userSession.userAgents.length) {
    return Object.fromEntries(
      assignablesIds.map((id) => [id, { role: getRoleMatchingActions([]), actions: [] }])
    );
  }

  const query = {
    $or: assignablesIds.map((id) => ({
      permissionName: { $regex: new RegExp(getPermissionName({ id, ctx }), 'i') },
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
          role: getRoleMatchingActions(directPermissions[id] || []),
          actions: directPermissions[id] || [],
        },
      ])
    );
  }

  const teacherPermissions = await getTeacherPermissions({ assignablesIds, ctx });

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
          role: getRoleMatchingActions(actions),
          actions,
        },
      ];
    })
  );
}

module.exports = { getUserPermissions };
