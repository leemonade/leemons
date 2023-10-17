const { beforeEach, describe, test, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { removePermission } = require('./removePermission');

const removePermissionHandler = jest.fn();

let ctx;

beforeEach(async () => {
  jest.resetAllMocks();

  ctx = generateCtx({
    actions: {
      'users.permissions.removeItems': removePermissionHandler,
    },
  });
});

describe('removePermission function', () => {
  test('should remove permission successfully', async () => {
    // Arrange
    const mockParams = {
      assignableInstance: 'assignableInstanceId1',
      assignable: 'assignableId1',
      ctx,
    };

    removePermissionHandler.mockResolvedValue(true);

    // Act
    const resp = await removePermission(mockParams);

    // Assert
    expect(removePermissionHandler).toBeCalledWith({
      query: {
        type: 'leemons-testing.assignableInstance',
        permissionName:
          'leemons-testing.assignable.assignableId1.assignableInstance.assignableInstanceId1',
      },
    });
    expect(resp).toBe(true);
  });

  test('should throw error if removeItems fails', async () => {
    // Arrange
    const mockParams = {
      assignableInstance: 'assignableInstanceId1',
      assignable: 'assignableId1',
      ctx,
    };

    removePermissionHandler.mockRejectedValue(new Error('removeItem failed'));

    // Act and Assert
    await expect(removePermission(mockParams)).rejects.toThrow(
      'Error removing permission: removeItem failed'
    );
  });
});
