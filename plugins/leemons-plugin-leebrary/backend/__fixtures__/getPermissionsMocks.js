/* eslint-disable sonarjs/no-duplicate-string */
module.exports = function getPermissionsMocks() {
  return {
    itemPermission: {
      actionName: 'owner',
      center: null,
      id: 'itemPermissionIdOne',
      item: 'assetOneId',
      permissionName: 'testing.(ASSET_ID)assetOneId',
      target: null,
      type: 'testing.13ce91bb-9135-49d9-9030-9d2559c74198', // in this case the uuid is an category id (old format)
      deleted: 0,
      created_at: '2023-07-25 09:27:28',
      updated_at: '2023-07-25 09:27:28',
      deleted_at: null,
    },
    userAgentPermission: {
      id: 'userAgenPermissionOne',
      userAgent: 'userAgentOne',
      permissionName: 'calendar.calendar.event.eventOneId',
      actionName: 'owner',
      target: null,
      role: 'roleOneId',
      center: null,
      deleted: 0,
      created_at: '2023-07-25 09:27:28',
      updated_at: '2023-07-25 09:27:28',
      deleted_at: null,
    },
    userAgentPermissionForAnAsset: {
      id: 'userAgentPermissionOne',
      userAgent: 'userAgentId1',
      permissionName: 'leemons-testing.(ASSET_ID)assetOne',
      actionName: 'owner',
      target: 'target',
      role: null,
      center: null,
      deleted: 0,
      created_at: '2023-07-25 09:27:28',
      updated_at: '2023-07-25 09:27:28',
      deleted_at: null,
    },
    permissionByAsset: {
      asset: 'privateAssetOne',
      role: 'owner',
      permissions: {
        assign: true,
        view: true,
        edit: true,
        duplicate: true,
        delete: true,
        comment: true,
        canAssign: ['assigner', 'viewer', 'commentor', 'editor', 'owner'],
        canUnassign: ['assigner', 'viewer', 'commentor', 'editor'],
      },
    },
    payloadToSetPermissionsByUser: {
      // writes in user-agent-permission
      canAccess: [{ userAgent: 'userAgentIdOne', role: 'viewer' }],
      isPublic: false,
      permissions: {
        viewer: [],
        editor: [],
        assigner: [],
      },
      deleteMissing: false,
    },
    payloadToSetPermissionsByClass: {
      // writes in item-permissions
      canAccess: [],
      isPublic: false,
      permissions: {
        viewer: [], // This will be the permissionName in item-permissions
        editor: ['academic-portfolio.class.classOneId'],
        assigner: [],
      },
    },
    payloadToRemoveAllPermissions: {
      canAccess: [],
      isPublic: false,
      deleteMissing: true,
      permissions: {
        viewer: [],
        editor: [],
        assigner: [],
      },
    },
  };
};
