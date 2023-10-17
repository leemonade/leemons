const { beforeEach, describe, test, expect } = require('@jest/globals');

const { generateCtx } = require('@leemons/testing');

const { removePermissionFromUser } = require('./removePermissionFromUser');
const { getUserPermission } = require('../getUserPermission');

jest.mock('../getUserPermission');

const removeCustomPermissionFromUserAgentHandler = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

describe('removePermissionFromUser function', () => {
  test('should remove permission from user successfully', async () => {
    // Arrange
    const pluginName = 'assignables';
    const ctx = generateCtx({
      actions: {
        'users.permissions.removeCustomPermissionFromUserAgent':
          removeCustomPermissionFromUserAgentHandler,
      },
      pluginName,
    });
    const actions = ['edit'];

    getUserPermission.mockResolvedValue({
      actions,
    });

    const mockParams = {
      assignable: { id: 'assignableId' },
      userAgent: { id: 'userAgentId' },
      ctx,
    };

    // Act
    const resp = await removePermissionFromUser(mockParams);

    // Assert
    expect(getUserPermission).toHaveBeenCalledWith({
      assignableId: mockParams.assignable,
      ctx: {
        ...ctx,
        meta: {
          ...ctx.meta,
          userSession: {
            ...ctx.meta.userSession,
            userAgents: [mockParams.userAgent],
          },
        },
      },
    });
    expect(removeCustomPermissionFromUserAgentHandler).toHaveBeenCalledWith({
      userAgentId: mockParams.userAgent.id,
      data: {
        permissionName: 'assignables.assignable.assignableId',
        actionNames: actions,
      },
    });
    expect(resp).toEqual({ userAgent: mockParams.userAgent, actions });
  });
});
