const {
  it,
  expect,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handlePermissions } = require('./handlePermissions');
const getUserSession = require('../../../__fixtures__/getUserSession');

const userSession = getUserSession();

it('Should call handlePermissions correctly', async () => {
  // Arrange
  const categoryId = 'categoryOne';
  const permissionsMockValue = 'Permissions';
  const itemsMockValue = 'View or edit items';
  const getUserAgentPermissions = fn().mockResolvedValue(permissionsMockValue);
  const getAllItemsForTheUserAgentHasPermissionsByType = fn().mockResolvedValue(itemsMockValue);

  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions': getUserAgentPermissions,
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
        getAllItemsForTheUserAgentHasPermissionsByType,
    },
  });
  ctx.meta.userSession = { ...userSession };

  // Act
  const response = await handlePermissions({
    userSession: ctx.meta.userSession,
    categoryId,
    ctx,
  });

  // Assert
  expect(getUserAgentPermissions).toBeCalledWith({
    userAgent: ctx.meta.userSession.userAgents,
    query: {
      permissionName: { $regex: `^${ctx.prefixPN('')}` },
      target: categoryId,
    },
  });
  expect(getAllItemsForTheUserAgentHasPermissionsByType).nthCalledWith(1, {
    userAgentId: ctx.meta.userSession.userAgents,
    type: ctx.prefixPN('asset.can-view'),
    ignoreOriginalTarget: true,
    target: categoryId,
  });
  expect(getAllItemsForTheUserAgentHasPermissionsByType).nthCalledWith(2, {
    userAgentId: ctx.meta.userSession.userAgents,
    type: ctx.prefixPN('asset.can-edit'),
    ignoreOriginalTarget: true,
    target: categoryId,
  });
  expect(response).toEqual([permissionsMockValue, itemsMockValue, itemsMockValue]);
});
