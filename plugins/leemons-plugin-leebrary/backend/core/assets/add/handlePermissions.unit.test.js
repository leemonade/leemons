const {
  it,
  expect,
  beforeEach,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handlePermissions } = require('./handlePermissions');
const { permissionSeparator, assetRoles } = require('../../../config/constants');
const getAssets = require('../../../__fixtures__/getAssets');
const getUserSession = require('../../../__fixtures__/getUserSession');

jest.mock('../../permissions/helpers/getAssetPermissionName');
const getAssetPermissionName = require('../../permissions/helpers/getAssetPermissionName');

const { assetModel: asset } = getAssets();
const userSession = getUserSession();

beforeEach(() => jest.resetAllMocks());

it('Should call the users service to add permissions and custom permissions for new assets', async () => {
  // Arrange
  const mockUsersPermissionsAddItem = fn(() => [Promise.resolve('test')]);
  const mockUsersPermissionsaddCustomPermissionToUserAgent = fn(() => [Promise.resolve('test')]);
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
  const mockUsersPermissionsAddItem = fn(() => [Promise.resolve('test')]);
  const mockUsersPermissionsaddCustomPermissionToUserAgent = fn(() => [Promise.resolve('test')]);

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

  const permissions = [
    {
      isCustomPermission: true,
      canEdit: true,
      canView: true,
      canAssign: true,
      id: 'permissionOneId',
    },
    {
      isCustomPermission: false,
      canEdit: false,
      canView: true,
      canAssign: false,
      id: 'permissionTwoId',
    },
    {
      isCustomPermission: false,
      canEdit: false,
      canView: true,
      canAssign: true,
      id: 'permissionThreeId',
    },
  ];
  const canAccess = [
    { userAgent: 'userAgentOne', role: 'owner' },
    { userAgent: 'userAgentTwo', role: 'editor' },
  ];

  // Act
  const responseNewAsset = await handlePermissions({
    permissions,
    canAccess,
    asset,
    category: { id: asset.category },
    ctx,
  });

  // Assert
  expect(getAssetPermissionName).toBeCalledWith({ assetId: asset.id, ctx });
  expect(mockUsersPermissionsAddItem).toBeCalledTimes(permissions.length + 1);
  permissions.forEach(({ isCustomPermission, canEdit, canView, canAssign, ...per }, index) => {
    let permissionType = 'can-view';
    if (canEdit) {
      permissionType = 'can-edit';
    } else if (canAssign) {
      permissionType = 'can-assign';
    }
    expect(mockUsersPermissionsAddItem).toHaveBeenNthCalledWith(index + 2, {
      item: asset.id,
      type: ctx.prefixPN(`asset.${permissionType}`),
      data: { ...per },
      isCustomPermission,
    });
  });
  expect(mockUsersPermissionsaddCustomPermissionToUserAgent).toBeCalledTimes(canAccess.length);
  canAccess.forEach((access, index) => {
    expect(mockUsersPermissionsaddCustomPermissionToUserAgent).toHaveBeenNthCalledWith(index + 1, {
      userAgentId: access.userAgent,
      data: {
        permissionName: assetPermissionName,
        actionNames: [access.role],
        target: asset.category,
      },
    });
  });
  expect(responseNewAsset).toBe(true);
});
