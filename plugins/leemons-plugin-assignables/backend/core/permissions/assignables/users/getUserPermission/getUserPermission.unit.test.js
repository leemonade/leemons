const { beforeEach, describe, test, expect } = require('@jest/globals');
const { escapeRegExp } = require('lodash');

const { generateCtx } = require('@leemons/testing');
const { getUserPermission } = require('./getUserPermission');

const { getTeacherPermission } = require('../getTeacherPermission');

jest.mock('../getTeacherPermission');

const getUserAgentPermissionsHandler = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getUserPermission function', () => {
  test('should get user permission successfully', async () => {
    // Arrange
    const pluginName = 'assignables';
    const ctx = generateCtx({
      actions: {
        'users.permissions.getUserAgentPermissions':
          getUserAgentPermissionsHandler,
      },
      pluginName,
    });

    getUserAgentPermissionsHandler.mockReturnValue([
      {
        permissionName: 'academic-portfolio.class.classId1',
        actionNames: ['edit', 'view', 'assign'],
      },
    ]);

    const mockParams = {
      assignableId: 'assignableId',
      ctx,
    };

    // Act
    const resp = await getUserPermission(mockParams);

    // Assert
    expect(getUserAgentPermissionsHandler).toHaveBeenCalledWith({
      userAgent: ctx.meta.userSession.userAgents,
      query: { permissionName: escapeRegExp('assignable.assignableId') },
    });
    expect(getTeacherPermission).not.toBeCalled();

    expect(resp).toEqual({
      role: 'editor',
      actions: ['assign', 'edit', 'view'],
    });
  });

  test('should get default user permissions successfully if not permissions found (valid for demo)', async () => {
    // Arrange
    const pluginName = 'assignables';
    const ctx = generateCtx({
      actions: {
        'users.permissions.getUserAgentPermissions':
          getUserAgentPermissionsHandler,
      },
      pluginName,
    });

    getUserAgentPermissionsHandler.mockReturnValue([]);

    getTeacherPermission.mockReturnValue([]);

    const mockParams = {
      assignableId: 'assignableId',
      ctx,
    };

    // Act
    const resp = await getUserPermission(mockParams);

    // Assert
    expect(getUserAgentPermissionsHandler).toHaveBeenCalledWith({
      userAgent: ctx.meta.userSession.userAgents,
      query: { permissionName: escapeRegExp('assignable.assignableId') },
    });
    expect(getTeacherPermission).toBeCalledWith(mockParams);

    expect(resp).toEqual({ role: 'viewer', actions: ['view'] });
  });
});
