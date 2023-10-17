const { it, beforeEach, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getUserPermission } = require('./getUserPermission');

const { getTeacherPermission } = require('../getTeacherPermission');

jest.mock('../getTeacherPermission');

const getUserAgentPermissionsHandler = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

it('Should get User Permissions', async () => {
  // Arrange
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions':
        getUserAgentPermissionsHandler,
    },
    pluginName: 'assignables',
  });

  const expectedValue = {
    actions: ['view'],
    role: 'student',
  };
  getUserAgentPermissionsHandler.mockResolvedValue([{ actionNames: ['view'] }]);

  const mockParams = {
    assignableInstance: 'assignableInstanceId',
    ctx,
  };

  // Act
  const response = await getUserPermission(mockParams);

  // Assert
  expect(getUserAgentPermissionsHandler).toBeCalledWith({
    userAgent: ctx.meta.userSession.userAgents,
    query: {
      permissionName: 'assignableInstance.assignableInstanceId',
    },
  });
  expect(getTeacherPermission).not.toBeCalled();
  expect(response).toEqual(expectedValue);
});

it('Should get teacher permissions', async () => {
  // Arrange
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions':
        getUserAgentPermissionsHandler,
    },
    pluginName: 'assignables',
  });

  const expectedValue = { actions: ['edit', 'view'], role: 'teacher' };

  getUserAgentPermissionsHandler.mockResolvedValue([]);
  getTeacherPermission.mockResolvedValue([{ actionNames: ['edit', 'view'] }]);

  const mockParams = {
    assignableInstance: 'assignableInstanceId',
    ctx,
  };

  // Act
  const response = await getUserPermission(mockParams);

  // Assert
  expect(getUserAgentPermissionsHandler).toBeCalledWith({
    userAgent: ctx.meta.userSession.userAgents,
    query: {
      permissionName: 'assignableInstance.assignableInstanceId',
    },
  });
  expect(getTeacherPermission).toBeCalledWith({
    assignableInstance: mockParams.assignableInstance,
    ctx,
  });
  expect(response).toEqual(expectedValue);
});

it('Should get default permissions', async () => {
  // Arrange
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions':
        getUserAgentPermissionsHandler,
    },
    pluginName: 'assignables',
  });

  const expectedValue = { actions: ['view'], role: 'viewer' };

  getUserAgentPermissionsHandler.mockResolvedValue([]);
  getTeacherPermission.mockResolvedValue([]);

  const mockParams = {
    assignableInstance: 'assignableInstanceId',
    ctx,
  };

  // Act
  const response = await getUserPermission(mockParams);

  // Assert
  expect(getUserAgentPermissionsHandler).toBeCalledWith({
    userAgent: ctx.meta.userSession.userAgents,
    query: {
      permissionName: 'assignableInstance.assignableInstanceId',
    },
  });
  expect(getTeacherPermission).toBeCalledWith({
    assignableInstance: mockParams.assignableInstance,
    ctx,
  });
  expect(response).toEqual(expectedValue);
});
