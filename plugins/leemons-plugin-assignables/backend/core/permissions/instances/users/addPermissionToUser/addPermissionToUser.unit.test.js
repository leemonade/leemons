const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { addPermissionToUser } = require('./addPermissionToUser');

const addPermissionToUserHandler = jest.fn();

it('Should add Permission to User', async () => {
  // Arrange
  const ctx = generateCtx({
    actions: {
      'users.permissions.addCustomPermissionToUserAgent':
        addPermissionToUserHandler,
    },
    pluginName: 'assignables',
  });

  const expectedValue = {
    actions: ['view', 'edit'],
    role: 'teacher',
    userAgents: ['userAgentId'],
  };
  const mockParams = {
    assignableInstance: 'assignableInstanceId',
    assignable: 'assignableId',
    userAgents: ['userAgentId'],
    role: 'teacher',
    ctx,
  };

  // Act
  const response = await addPermissionToUser(mockParams);

  // Assert
  expect(addPermissionToUserHandler).toBeCalledWith({
    userAgentId: mockParams.userAgents,
    data: {
      permissionName:
        'assignables.assignable.assignableId.assignableInstance.assignableInstanceId',
      actionNames: ['view', 'edit'],
    },
  });
  expect(response).toEqual(expectedValue);
});
