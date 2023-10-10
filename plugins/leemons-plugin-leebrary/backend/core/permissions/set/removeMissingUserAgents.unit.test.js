const {
  it,
  expect,
  beforeEach,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { removeMissingUserAgents } = require('./removeMissingUserAgents');
const getUserSession = require('../../../__fixtures__/getUserSession');
const { permissionSeparator } = require('../../../config/constants');

// MOCKS
jest.mock('./removeMissingUserAgent');
const { removeMissingUserAgent } = require('./removeMissingUserAgent');

beforeEach(() => jest.resetAllMocks());

const userSession = getUserSession();

it('Should correctly remove user agent permissions', async () => {
  // Arrange
  const asset = { id: 'assetOne', category: 'categoryId' };
  const findUserAgentsWithPermissionAction = fn().mockResolvedValue([
    'userAgentIdOne',
    'userAgentIdTwo',
  ]);
  const ctx = generateCtx({
    actions: {
      'users.permissions.findUserAgentsWithPermission': findUserAgentsWithPermissionAction,
    },
  });
  ctx.meta.userSession = { ...userSession };
  const permissionName = ctx.prefixPN(permissionSeparator + asset.id);

  // Act
  await removeMissingUserAgents({
    id: asset.id,
    toUpdate: [],
    assignerRole: 'owner',
    permissionName,
    currentUserAgentIds: [ctx.meta.userSession.userAgents[0].id],
    ctx,
  });

  // Assert
  expect(findUserAgentsWithPermissionAction).toBeCalledWith({ permissions: { permissionName } });
  expect(removeMissingUserAgent).toBeCalledWith({
    id: asset.id,
    userAgent: expect.stringMatching('userAgentId'),
    assignerRole: 'owner',
    permissionName,
    ctx,
  });
  expect(removeMissingUserAgent).toBeCalledTimes(2);
});

it('Should not remove the current user permission', async () => {
  // Arrange
  const asset = { id: 'assetOne', category: 'categoryId' };
  const findUserAgentsWithPermissionAction = fn().mockResolvedValue([userSession.userAgents[0].id]);
  const ctx = generateCtx({
    actions: {
      'users.permissions.findUserAgentsWithPermission': findUserAgentsWithPermissionAction,
    },
  });
  ctx.meta.userSession = { ...userSession };
  const permissionName = ctx.prefixPN(permissionSeparator + asset.id);

  // Act
  await removeMissingUserAgents({
    id: asset.id,
    toUpdate: [],
    assignerRole: 'owner',
    permissionName,
    currentUserAgentIds: [ctx.meta.userSession.userAgents[0].id],
    ctx,
  });

  // Assert
  expect(findUserAgentsWithPermissionAction).toBeCalledWith({ permissions: { permissionName } });
  expect(removeMissingUserAgent).not.toBeCalled();
});
