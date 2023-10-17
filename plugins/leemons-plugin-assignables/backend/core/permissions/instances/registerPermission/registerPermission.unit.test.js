const { beforeEach, describe, test, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { registerPermission } = require('./registerPermission');

const addItemHandler = jest.fn();

let ctx;

beforeEach(async () => {
  jest.resetAllMocks();

  ctx = generateCtx({
    actions: {
      'users.permissions.addItem': addItemHandler,
    },
  });
});

describe('registerPermission function', () => {
  test('should register permission successfully', async () => {
    // Arrange
    const mockParams = {
      assignableInstance: 'assignableInstanceId1',
      assignable: 'assignableId1',
      ctx,
    };

    addItemHandler.mockResolvedValue(true);

    // Act
    const resp = await registerPermission(mockParams);

    // Assert
    expect(addItemHandler).toBeCalledWith({
      item: 'assignableInstanceId1',
      type: 'leemons-testing.assignableInstance',
      data: {
        permissionName:
          'leemons-testing.assignable.assignableId1.assignableInstance.assignableInstanceId1',
        actionNames: ['view', 'edit'],
      },
      isCustomPermission: true,
    });
    expect(resp).toBe(true);
  });

  test('should throw error if addItem fails', async () => {
    // Arrange
    const mockParams = {
      assignableInstance: 'assignableInstanceId1',
      assignable: 'assignableId1',
      ctx,
    };

    addItemHandler.mockRejectedValue(new Error('addItem failed'));

    // Act and Assert
    await expect(registerPermission(mockParams)).rejects.toThrow(
      'Error registering permission: addItem failed'
    );
  });
});
