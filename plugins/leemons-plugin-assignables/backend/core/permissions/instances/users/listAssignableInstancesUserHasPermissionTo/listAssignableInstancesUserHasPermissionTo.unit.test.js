const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const getAllItemsForTheUserAgentHasPermissionsByTypeHandler = jest.fn();

const {
  listAssignableInstancesUserHasPermissionTo,
} = require('./listAssignableInstancesUserHasPermissionTo');

it('Should list instances that user has permission', async () => {
  // Arrange
  const expectedValue = ['instanceId1', 'instanceId2'];

  const ctx = generateCtx({
    actions: {
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
        getAllItemsForTheUserAgentHasPermissionsByTypeHandler,
    },
  });

  getAllItemsForTheUserAgentHasPermissionsByTypeHandler.mockReturnValue(
    expectedValue
  );

  // Act
  const response = await listAssignableInstancesUserHasPermissionTo({ ctx });

  // Assert
  expect(getAllItemsForTheUserAgentHasPermissionsByTypeHandler).toBeCalledWith({
    userAgentId: ctx.meta.userSession.userAgents.map((u) => u.id),
    type: ctx.prefixPN('assignableInstance'),
  });
  expect(response).toBe(expectedValue);
});
