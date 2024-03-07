const { beforeEach, describe, test, expect } = require('@jest/globals');

const { generateCtx } = require('@leemons/testing');

const { addPermissionToUser } = require('./addPermissionToUser');
const { assignableRolesObject } = require('../../../../../config/constants');

const addCustomPermissionToUserAgentHandle = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

describe('addPermissionToUser function', () => {
  test('should add permission to user successfully', async () => {
    // Arrange
    const pluginName = 'assignables';
    const ctx = generateCtx({
      actions: {
        'users.permissions.addCustomPermissionToUserAgent':
          addCustomPermissionToUserAgentHandle,
      },
      pluginName,
    });

    const mockParams = {
      id: 'assignableId',
      userAgents: ['userAgentId'],
      role: 'editor',
      ctx,
    };
    const { actions } = assignableRolesObject[mockParams.role];

    // Act
    const resp = await addPermissionToUser(mockParams);

    // Assert
    expect(addCustomPermissionToUserAgentHandle).toHaveBeenCalledWith({
      userAgentId: mockParams.userAgents,
      data: {
        permissionName: ctx.prefixPN(`assignable.${mockParams.id}`),
        actionNames: actions,
      },
    });
    expect(resp).toEqual({
      userAgents: mockParams.userAgents,
      role: mockParams.role,
      actions,
    });
  });
});
