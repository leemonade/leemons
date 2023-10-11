const {
  it,
  expect,
  beforeEach,
  jest: { spyOn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleRemoveMissingPermissions } = require('./handleRemoveMissingPermissions');
const getPermissionsMocks = require('../../../__fixtures__/getPermissionsMocks');
const getUserSession = require('../../../__fixtures__/getUserSession');
const { permissionSeparator } = require('../../../config/constants');

// MOCKS
jest.mock('./removeMissingPermissions');
jest.mock('./removeMissingUserAgents');

const { removeMissingPermissions } = require('./removeMissingPermissions');
const { removeMissingUserAgents } = require('./removeMissingUserAgents');

beforeEach(() => jest.resetAllMocks());

const { payloadToRemoveAllPermissions: payload } = getPermissionsMocks();
const userSession = getUserSession();

it('Should be called correctly', async () => {
  // Arrange
  const asset = { id: 'assetOne', category: 'categoryId' };
  const ctx = generateCtx({});
  ctx.meta.userSession = { ...userSession };
  const expectedPermissionName = ctx.prefixPN(permissionSeparator + asset.id);
  const spyPromises = spyOn(Promise, 'all');

  removeMissingUserAgents.mockImplementation(() => Promise.resolve(undefined));
  removeMissingPermissions.mockImplementation(() => undefined);

  // Act
  await handleRemoveMissingPermissions({
    canAccess: payload.canAccess,
    permissions: payload.permissions,
    assetIds: [asset.id],
    assetsRoleById: { [asset.id]: 'owner' },
    ctx,
  });

  // Assert
  expect(removeMissingUserAgents).toBeCalledWith({
    id: asset.id,
    toUpdate: [],
    assignerRole: 'owner',
    permissionName: expectedPermissionName,
    currentUserAgentIds: [ctx.meta.userSession.userAgents[0].id],
    ctx,
  });
  expect(removeMissingPermissions).toBeCalledWith({
    id: asset.id,
    permissions: payload.permissions,
    assignerRole: 'owner',
    ctx,
  });
  expect(spyPromises).toHaveBeenCalled();
});

it('Should await for promises only if necessary', async () => {
  // Arrange
  const asset = { id: 'assetOne', category: 'categoryId' };
  const ctx = generateCtx({});
  ctx.meta.userSession = { ...userSession };
  const spyPromises = spyOn(Promise, 'all');

  // Act
  await handleRemoveMissingPermissions({
    canAccess: payload.canAccess,
    permissions: payload.permissions,
    assetIds: [asset.id],
    assetsRoleById: { [asset.id]: 'owner' },
    ctx,
  });

  // Assert
  expect(spyPromises).not.toHaveBeenCalled();
});
