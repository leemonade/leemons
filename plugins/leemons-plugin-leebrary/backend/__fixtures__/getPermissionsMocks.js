/* eslint-disable sonarjs/no-duplicate-string */
module.exports = function getPermissionsMocks() {
  return {
    itemPermission: {
      id: 'itemPermissionIdOne',
      permissionName: 'testing.(ASSET_ID)assetOneId',
      actionName: 'owner', // view, viewer, editor, delete, assigner, assign, update, commentor
      target: null,
      type: 'testing.13ce91bb-9135-49d9-9030-9d2559c74198',
      item: 'assetOneId',
      center: null,
      deleted: 0,
      created_at: '2023-07-25 09:27:28',
      updated_at: '2023-07-25 09:27:28',
      deleted_at: null,
    },
    userAgentPermission: {
      id: 'userAgentIdOne',
      userAgent: 'userAgentOne',
      perissionName: 'calendar.calendar.event.eventOneId',
      action: 'owner',
      target: null,
      role: 'roleOneId',
      center: null,
      deleted: 0,
      created_at: '2023-07-25 09:27:28',
      updated_at: '2023-07-25 09:27:28',
      deleted_at: null,
    },
    userAgentPermissionAsset: {
      id: 'userAgentPermissionOne',
      userAgent: 'userAgentId1',
      permissionName: 'leemons-testing.(ASSET_ID)assetOne',
      actionName: 'owner', // ? actionName? isn't it action?
      target: 'uuidTarget',
      role: null,
      center: null,
      deleted: 0,
      created_at: '2023-07-25 09:27:28',
      updated_at: '2023-07-25 09:27:28',
      deleted_at: null,
    },
    permissionByAssetOne: {
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
  };
};
