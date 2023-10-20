/* eslint-disable sonarjs/no-duplicate-string */
const {
  it,
  expect,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getUserPermissionsByAsset } = require('./getUserPermissionsByAsset');

it('Should handle permissions by asset correctly', async () => {
  // Arrange
  const userPermissionsGetItemPermissions = fn(({ type }) => {
    const permissions = [
      {
        permissionName: 'permission1',
        actionName: 'actionName',
        type: 'asset.can-view',
        item: 'asset1',
      },
      {
        permissionName: 'permission2',
        actionName: 'actionName',
        type: 'asset.can-view',
        item: 'asset2',
      },
      {
        permissionName: 'permission3',
        actionName: 'actionName',
        type: 'asset.can-edit',
        item: 'asset1',
      },
      {
        permissionName: 'permission4',
        actionName: 'actionName',
        type: 'asset.can-assign',
        item: 'asset1',
      },
    ];
    return Promise.resolve(permissions.filter((item) => `testing.${item.type}` === type));
  });
  const userPermissionsGetAllItemsForTheUserAgentHasPermissionsByType = fn();
  const expectedValue = [
    {
      asset1: { viewer: ['permission1'], editor: ['permission3'], assigner: ['permission4'] },
      asset2: { viewer: ['permission2'], editor: [], assigner: [] },
    },
    [],
  ];

  const ctx = generateCtx({
    actions: {
      'users.permissions.getItemPermissions': userPermissionsGetItemPermissions,
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
        userPermissionsGetAllItemsForTheUserAgentHasPermissionsByType,
    },
    pluginName: 'testing',
  });
  delete ctx.meta.userSession;

  // Act
  const response = await getUserPermissionsByAsset({
    assets: [{ id: 'asset1' }, { id: 'asset2' }],
    ctx,
  });

  // Assert
  expect(response).toEqual(expectedValue);
  expect(userPermissionsGetItemPermissions).nthCalledWith(1, {
    item: [{ id: 'asset1' }, { id: 'asset2' }].map((asset) => asset.id),
    type: ctx.prefixPN('asset.can-view'),
    returnRaw: true,
  });
  expect(userPermissionsGetItemPermissions).nthCalledWith(2, {
    item: [{ id: 'asset1' }, { id: 'asset2' }].map((asset) => asset.id),
    type: ctx.prefixPN('asset.can-edit'),
    returnRaw: true,
  });
  expect(userPermissionsGetItemPermissions).nthCalledWith(3, {
    item: [{ id: 'asset1' }, { id: 'asset2' }].map((asset) => asset.id),
    type: ctx.prefixPN('asset.can-assign'),
    returnRaw: true,
  });
  expect(userPermissionsGetAllItemsForTheUserAgentHasPermissionsByType).not.toBeCalled();
});

it('Should handle canEditPermissions correctly', async () => {
  // Arrange
  const userPermissionsGetItemPermissions = fn(() => Promise.resolve([]));
  const userPermissionsGetAllItemsForTheUserAgentHasPermissionsByType = fn(() =>
    Promise.resolve(['permission1'])
  );

  const ctx = generateCtx({
    actions: {
      'users.permissions.getItemPermissions': userPermissionsGetItemPermissions,
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
        userPermissionsGetAllItemsForTheUserAgentHasPermissionsByType,
    },
  });
  ctx.meta.userSession = {
    userAgents: 'userAgent1',
  };
  const expectedValue = [{}, ['permission1']];

  // Act
  const response = await getUserPermissionsByAsset({ assets: [{ id: 'asset1' }], ctx });

  // Assert
  expect(response).toEqual(expectedValue);
  expect(userPermissionsGetAllItemsForTheUserAgentHasPermissionsByType).toBeCalledWith({
    userAgentId: 'userAgent1',
    type: ctx.prefixPN('asset.can-edit'),
    ignoreOriginalTarget: true,
    item: ['asset1'],
  });
  expect(userPermissionsGetItemPermissions).toBeCalledTimes(3);
});
