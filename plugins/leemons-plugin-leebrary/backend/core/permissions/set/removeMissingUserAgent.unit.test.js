const {
  it,
  expect,
  beforeEach,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');

const { removeMissingUserAgent } = require('./removeMissingUserAgent');
const getUserSession = require('../../../__fixtures__/getUserSession');
const { permissionSeparator } = require('../../../config/constants');

// MOCKS
jest.mock('../helpers/canUnassignRole');
jest.mock('../getByAsset');
const canUnassignRole = require('../helpers/canUnassignRole');
const { getByAsset } = require('../getByAsset');

beforeEach(() => jest.resetAllMocks());

const userSession = getUserSession();

it('Should correctly remove user agent permissions', async () => {
  // Arrange
  const asset = { id: 'assetOne', category: 'categoryId' };
  const userAgentToRemoveId = 'userAgentId';
  const removeCustomUserAgentPermissionAction = fn();
  const ctx = generateCtx({
    actions: {
      'users.permissions.removeCustomUserAgentPermission': removeCustomUserAgentPermissionAction,
    },
  });
  ctx.meta.userSession = { ...userSession };
  const permissionName = ctx.prefixPN(permissionSeparator + asset.id);

  getByAsset.mockResolvedValue({ canAccessRole: 'editor' });
  canUnassignRole.mockReturnValue(true);

  // Act
  await removeMissingUserAgent({
    id: asset.id,
    userAgent: userAgentToRemoveId,
    assignerRole: 'owner',
    permissionName,
    ctx,
  });

  // Assert
  expect(getByAsset).toBeCalledWith({
    assetId: asset.id,
    ctx: {
      ...ctx,
      meta: { ...ctx.meta, userSession: { userAgents: [{ id: userAgentToRemoveId }] } },
    },
  });
  expect(removeCustomUserAgentPermissionAction).toBeCalledWith({
    userAgentId: userAgentToRemoveId,
    data: {
      permissionName,
    },
  });
});

it('Should throw a Leemons error when the assigner is not allowed to assign the role to the assignee', async () => {
  // Arrange
  const asset = { id: 'assetOne', category: 'categoryId' };
  const userAgentToRemoveId = 'userAgentId';
  const removeCustomUserAgentPermissionAction = fn();
  const ctx = generateCtx({
    actions: {
      'users.permissions.removeCustomUserAgentPermission': removeCustomUserAgentPermissionAction,
    },
  });
  ctx.meta.userSession = { ...userSession };
  const permissionName = ctx.prefixPN(permissionSeparator + asset.id);

  getByAsset.mockResolvedValue({ canAccessRole: 'viewer' });
  canUnassignRole.mockReturnValue(false);

  try {
    // Act
    await removeMissingUserAgent({
      id: asset.id,
      userAgent: userAgentToRemoveId,
      assignerRole: 'owner',
      permissionName,
      ctx,
    });
  } catch (error) {
    // Assert
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(401);
    expect(removeCustomUserAgentPermissionAction).not.toBeCalled();
  }
});

it('Should identify an owner and avoid removing their permission', async () => {
  // Arrange
  const asset = { id: 'assetOne', category: 'categoryId' };
  const userAgentToRemoveId = 'userAgentId';
  const ctx = generateCtx({
    actions: {},
  });
  ctx.meta.userSession = { ...userSession };
  const permissionName = ctx.prefixPN(permissionSeparator + asset.id);

  getByAsset.mockResolvedValue({ canAccessRole: 'owner' });

  // Act
  await removeMissingUserAgent({
    id: asset.id,
    userAgent: userAgentToRemoveId,
    assignerRole: 'owner',
    permissionName,
    ctx,
  });

  // Assert
  expect(canUnassignRole).not.toBeCalled();
});
