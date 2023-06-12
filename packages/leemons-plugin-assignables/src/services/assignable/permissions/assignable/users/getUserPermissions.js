const { uniq, difference, map, groupBy, uniqBy, pick } = require('lodash');
const permission = require('../../permission');
const getRoleMatchingActions = require('../getRoleMatchingActions');
const getTeacherPermissions = require('./getTeacherPermissions');
const getPermissionName = require('../getPermissionName');
const { assignables: assignablesTable } = require('../../../../tables');

// EN: a parent assignable is the one which has the following text in submissions field: `"activity":"ID"`
// ES: Un asignable padre es el que tiene el texto en el campo submissions: `"activity":"ID"`
async function getParentAssignables(ids, { transacting }) {
  const parentAssignables = await assignablesTable.find(
    {
      $or: ids.map((id) => ({ submission_$contains: `"activity":"${id}"` })),
    },
    { transacting, columns: ['asset', 'submission'] }
  );

  // get object with keys as activities ids and values as array of parents
  return groupBy(
    parentAssignables
      .flatMap((parent) => {
        const submission = JSON.parse(parent.submission) ?? {};
        const activities = uniq(map(submission.activities, 'activity'));

        if (!activities.length) {
          return null;
        }

        return activities.map((activity) => ({
          asset: parent.asset,
          activity,
        }));
      })
      .filter(Boolean),
    'asset'
  );
}

async function getParentPermissions(ids, { userSession, transacting }) {
  const parents = await getParentAssignables(ids, { transacting });
  const assetsIds = Object.keys(parents);
  const itemPermissions = await permission.getAllItemsForTheUserAgentHasPermissionsByType(
    userSession.userAgents,
    'plugins.leebrary.asset.can-assign',
    { ignoreOriginalTarget: true, item: assetsIds, transacting }
  );

  const activitiesWithPermissions = uniqBy(
    Object.values(pick(parents, itemPermissions)).flat(),
    'activity'
  );
  return activitiesWithPermissions.map(({ activity }) => [activity, ['view']]);
}

// TODO: Impelement item permissions for teachers

module.exports = async function getUserPermissions(assignables, { userSession, transacting } = {}) {
  const assignablesIds = uniq(map(assignables, 'id'));
  const assetsIds = uniq(map(assignables, 'asset'));
  const assignablesByAsset = groupBy(assignables, 'asset');

  if (!userSession?.userAgents?.length) {
    return Object.fromEntries(
      assignablesIds.map((id) => [
        id,
        {
          role: getRoleMatchingActions([]),
          actions: [],
        },
      ])
    );
  }

  const query = {
    $or: assignablesIds.map((id) => ({ permissionName_$contains: getPermissionName(id) })),
  };

  const [permissions, canAssignPerms, parentPermissions] = await Promise.all([
    permission.getUserAgentPermissions(userSession?.userAgents, {
      query,
      transacting,
    }),
    permission.getAllItemsForTheUserAgentHasPermissionsByType(
      userSession.userAgents,
      'plugins.leebrary.asset.can-assign',
      { ignoreOriginalTarget: true, item: assetsIds, transacting }
    ),
    getParentPermissions(assignablesIds, { userSession, transacting }),
  ]);

  const directPermissions = Object.fromEntries(
    permissions
      .map(({ permissionName, actionNames }) => [
        // plugins.assignables.assignable.* -> length of common part: 31
        // Sometimes PermissionName like: plugins.assignables.assignable.addfcaa9-9ce9-4420-ac40-f12b49107b94@1.0.0.assignableInstance.020f9aca-7486-47ce-a858-c098972b118a
        new RegExp(/\.assignable\.(?<id>[^@]+@(\d+\.){2}\d+)/).exec(permissionName).groups.id,
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

  const teacherPermissions = await getTeacherPermissions(assignablesIds, {
    userSession,
    transacting,
  });

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
};
