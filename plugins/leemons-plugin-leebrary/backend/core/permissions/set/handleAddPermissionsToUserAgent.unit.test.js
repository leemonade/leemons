const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleAddPermissionsToUserAgent } = require('./handleAddPermissionsToUserAgent');
const getUserSession = require('../../../__fixtures__/getUserSession');
const getPermissionsMocks = require('../../../__fixtures__/getPermissionsMocks');
const { permissionSeparator } = require('../../../config/constants');

// MOCKS
jest.mock('./addPermissionsToUserAgent');
const { addPermissionsToUserAgent } = require('./addPermissionsToUserAgent');

beforeEach(() => jest.resetAllMocks());

const userSession = getUserSession();
const { payloadToSetPermissionsByUser: payload } = getPermissionsMocks();

it('Should call handleAddPermissionsToUserAgent correctly', async () => {
  // Arrange
  const asset = { id: 'assetOne', category: 'categoryId' };
  const ctx = generateCtx({});
  ctx.meta.userSession = { ...userSession };
  const expectedPermissionName = ctx.prefixPN(permissionSeparator + asset.id);

  addPermissionsToUserAgent.mockResolvedValue([{ id: 'item-permissionId' }]);

  // Act
  await handleAddPermissionsToUserAgent({
    canAccess: payload.canAccess,
    assetIds: [asset.id],
    assetsDataById: { [asset.id]: { ...asset } },
    assetsRoleById: { [asset.id]: 'owner' },
    ctx,
  });

  // Assert
  expect(addPermissionsToUserAgent).toBeCalledWith({
    id: asset.id,
    role: payload.canAccess[0].role,
    userAgent: payload.canAccess[0].userAgent,
    categoryId: asset.category,
    assignerRole: 'owner',
    permissionName: expectedPermissionName,
    ctx,
  });
});

it('Should not try to create userAgent permissions when is not necesary', async () => {
  // Arrange
  const asset = { id: 'assetTwo', category: 'categoryIdTwo' };
  const ctx = generateCtx({});
  ctx.meta.userSession = { ...userSession, userAgents: [{ id: payload.canAccess[0].userAgent }] };

  // Act
  await handleAddPermissionsToUserAgent({
    canAccess: payload.canAccess,
    assetIds: [asset.id],
    assetsDataById: { [asset.id]: { ...asset } },
    assetsRoleById: { [asset.id]: 'owner' },
    ctx,
  });

  // Assert
  expect(addPermissionsToUserAgent).not.toBeCalled();
});
