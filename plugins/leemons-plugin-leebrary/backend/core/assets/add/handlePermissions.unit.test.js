const {
  it,
  expect,
  describe,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { handlePermissions } = require('./handlePermissions');
const { permissionSeparator, assetRoles } = require('../../../config/constants');
const getAssets = require('../../../__fixtures__/getAssets');
const getUserSession = require('../../../__fixtures__/getUserSession');

jest.mock('../../permissions/helpers/getAssetPermissionName');
const getAssetPermissionName = require('../../permissions/helpers/getAssetPermissionName');

const mockUsersPermissionsAddItem = fn(() => [
  new Promise((res) => {
    res('foo');
  }),
]);
const mockUsersPermissionsaddCustomPermissionToUserAgent = fn(() => [
  new Promise((res) => {
    res('bar');
  }),
]);
const { assetModel: asset } = getAssets();
const userSession = getUserSession();

describe('When called correctly, handlePermissions() helper function:', () => {
  it('Should call the users service to add permissions and custom permissions for new assets', async () => {
    // Arrange
    const ctx = generateCtx({
      actions: {
        'users.permissions.addItem': mockUsersPermissionsAddItem,
        'users.permissions.addCustomPermissionToUserAgent':
          mockUsersPermissionsaddCustomPermissionToUserAgent,
      },
    });
    ctx.meta.userSession = { ...userSession };

    const assetPermissionName = ctx.prefixPN(permissionSeparator + asset.id);
    getAssetPermissionName.mockReturnValue(assetPermissionName);

    // Act
    const responseNewAsset = await handlePermissions({
      permissions: [],
      asset,
      category: { id: asset.category },
      ctx,
    });

    // Assert
    expect(getAssetPermissionName).toBeCalledWith({ assetId: asset.id, ctx });
    expect(mockUsersPermissionsAddItem).toBeCalledWith({
      item: asset.id,
      type: ctx.prefixPN(asset.category),
      data: { permissionName: assetPermissionName, actionNames: assetRoles },
      isCustomPermission: true,
    });
    expect(mockUsersPermissionsAddItem).toBeCalledTimes(1);
    expect(mockUsersPermissionsaddCustomPermissionToUserAgent).toBeCalledWith({
      userAgentId: userSession.userAgents.map((uA) => uA.id),
      data: {
        permissionName: assetPermissionName,
        actionNames: ['owner'],
        target: asset.category,
      },
    });
    expect(mockUsersPermissionsaddCustomPermissionToUserAgent).toBeCalledTimes(1);
    expect(responseNewAsset).toBe(true);
  });

  it('Should call the users service to add permissions and custom permissions for existent assets', async () => {
    // Arrange
    const ctx = generateCtx({
      actions: {
        'users.permissions.addItem': mockUsersPermissionsAddItem,
        'users.permissions.addCustomPermissionToUserAgent':
          mockUsersPermissionsaddCustomPermissionToUserAgent,
      },
    });
    ctx.meta.userSession = { ...userSession };

    const assetPermissionName = ctx.prefixPN(permissionSeparator + asset.id);
    getAssetPermissionName.mockReturnValue(assetPermissionName);

    // Act
    //   const responseNewAsset = await handlePermissions({
    //     permissions: [
    //       { permissionName: 'name', pluginName: 'pluginName', id: 'semanticPermissionId' },
    //     ],
    //     canAccess: [{ id: 'userId' }],
    //     asset,
    //     category: { id: asset.category },
    //     ctx,
    //   });
    // });

    // TODO Paola: terminar este happy path. permissions y can access con mocks reales.
  });
});
