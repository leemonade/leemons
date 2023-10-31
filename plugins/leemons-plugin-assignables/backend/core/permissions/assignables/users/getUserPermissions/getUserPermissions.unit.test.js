const { beforeEach, describe, test, expect } = require('@jest/globals');

const { generateCtx } = require('@leemons/testing');

const { getUserPermissions } = require('./getUserPermissions');

const { getTeacherPermissions } = require('../getTeacherPermissions');
const { getParentPermissions } = require('./getParentPermissions');

const getUserAgentPermissionsHandle = jest.fn();

const getAllItemsForTheUserAgentHasPermissionsByTypeHandler = jest.fn();

const permissionName = 'assignables.assignable.assignableId1@2.0.0';
const assignableIds = ['assignableId1@2.0.0', 'assignableId2@2.0.0', 'assignableId3@2.0.0'];

jest.mock('../getTeacherPermissions');
jest.mock('./getParentPermissions');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getUserPermissions function', () => {
  test('should get user permissions successfully', async () => {
    // Arrange
    const pluginName = 'assignables';
    const ctx = generateCtx({
      actions: {
        'users.permissions.getUserAgentPermissions': getUserAgentPermissionsHandle,
        'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
          getAllItemsForTheUserAgentHasPermissionsByTypeHandler,
      },
      pluginName,
    });

    getUserAgentPermissionsHandle.mockResolvedValue([{ permissionName, actionNames: ['edit'] }]);

    getParentPermissions.mockResolvedValue([
      [assignableIds[1], ['view']],
      [assignableIds[2], ['view']],
    ]);

    getAllItemsForTheUserAgentHasPermissionsByTypeHandler.mockResolvedValue(['assetId1']);

    const mockParams = {
      assignables: [{ id: assignableIds[0], asset: 'assetId1' }],
      ctx,
    };

    // Act
    const resp = await getUserPermissions(mockParams);

    // Assert
    expect(getUserAgentPermissionsHandle).toHaveBeenCalledWith({
      userAgent: ctx.meta.userSession.userAgents,
      query: {
        $or: [
          {
            permissionName: { $regex: /assignable\.assignableId1@2\.0\.0/i },
          },
        ],
      },
    });
    expect(getUserAgentPermissionsHandle).toHaveBeenCalled();
    expect(getAllItemsForTheUserAgentHasPermissionsByTypeHandler).toHaveBeenCalled();
    expect(getParentPermissions).toHaveBeenCalledWith({
      ids: mockParams.assignables.map((assignable) => assignable.id),
      ctx,
    });
    expect(getTeacherPermissions).not.toBeCalled();
    expect(resp).toEqual({
      [assignableIds[0]]: {
        role: 'viewer',
        actions: ['view'],
      },
    });
  });

  test('should get user permissions successfully if there are assignables without direct permissions but user is teacher', async () => {
    // Arrange
    const pluginName = 'assignables';
    const ctx = generateCtx({
      actions: {
        'users.permissions.getUserAgentPermissions': getUserAgentPermissionsHandle,
        'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
          getAllItemsForTheUserAgentHasPermissionsByTypeHandler,
      },
      pluginName,
    });

    getUserAgentPermissionsHandle.mockResolvedValue([{ permissionName, actionNames: ['edit'] }]);

    getParentPermissions.mockResolvedValue([
      [assignableIds[1], ['view']],
      [assignableIds[2], ['view']],
    ]);

    getAllItemsForTheUserAgentHasPermissionsByTypeHandler.mockResolvedValue(['assetId1']);

    getTeacherPermissions.mockResolvedValue({
      'assignableId4@2.0.0': true,
    });

    const mockParams = {
      assignables: [
        { id: assignableIds[0], asset: 'assetId1' },
        { id: 'assignableId4@2.0.0', asset: 'assetId2' },
      ],
      ctx,
    };

    // Act
    const resp = await getUserPermissions(mockParams);

    // Assert
    expect(getUserAgentPermissionsHandle).toHaveBeenCalledWith({
      userAgent: ctx.meta.userSession.userAgents,
      query: {
        $or: [
          {
            permissionName: { $regex: /assignable\.assignableId1@2\.0\.0/i },
          },
          {
            permissionName: { $regex: /assignable\.assignableId4@2\.0\.0/i },
          },
        ],
      },
    });
    expect(getUserAgentPermissionsHandle).toHaveBeenCalled();
    expect(getAllItemsForTheUserAgentHasPermissionsByTypeHandler).toHaveBeenCalled();
    expect(getParentPermissions).toHaveBeenCalledWith({
      ids: mockParams.assignables.map((assignable) => assignable.id),
      ctx,
    });
    expect(getTeacherPermissions).toBeCalledWith({
      assignableIds: mockParams.assignables.map((assignable) => assignable.id),
      ctx,
    });

    expect(resp).toEqual({
      [assignableIds[0]]: {
        role: 'viewer',
        actions: ['view'],
      },
      'assignableId4@2.0.0': {
        role: 'editor',
        actions: ['assign', 'edit', 'view'],
      },
    });
  });

  test('should get user permissions successfully if there are assignables without permissions', async () => {
    // Arrange
    const pluginName = 'assignables';
    const ctx = generateCtx({
      actions: {
        'users.permissions.getUserAgentPermissions': getUserAgentPermissionsHandle,
        'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
          getAllItemsForTheUserAgentHasPermissionsByTypeHandler,
      },
      pluginName,
    });

    getUserAgentPermissionsHandle.mockResolvedValue([
      {
        permissionName: 'assignables.assignable.assignableId1@2.0.0',
        actionNames: ['edit'],
      },
    ]);

    getParentPermissions.mockResolvedValue([
      [assignableIds[1], ['view']],
      [assignableIds[2], ['view']],
    ]);

    getAllItemsForTheUserAgentHasPermissionsByTypeHandler.mockResolvedValue(['assetId1']);

    getTeacherPermissions.mockResolvedValue({});

    const mockParams = {
      assignables: [
        { id: assignableIds[0], asset: 'assetId1' },
        { id: 'assignableId4@2.0.0', asset: 'assetId2' },
      ],
      ctx,
    };

    // Act
    const resp = await getUserPermissions(mockParams);

    // Assert
    expect(getUserAgentPermissionsHandle).toHaveBeenCalledWith({
      userAgent: ctx.meta.userSession.userAgents,
      query: {
        $or: [
          {
            permissionName: { $regex: /assignable\.assignableId1@2\.0\.0/i },
          },
          {
            permissionName: { $regex: /assignable\.assignableId4@2\.0\.0/i },
          },
        ],
      },
    });
    expect(getUserAgentPermissionsHandle).toHaveBeenCalled();
    expect(getAllItemsForTheUserAgentHasPermissionsByTypeHandler).toHaveBeenCalled();
    expect(getParentPermissions).toHaveBeenCalledWith({
      ids: mockParams.assignables.map((assignable) => assignable.id),
      ctx,
    });
    expect(getTeacherPermissions).toBeCalledWith({
      assignableIds: mockParams.assignables.map((assignable) => assignable.id),
      ctx,
    });

    expect(resp).toEqual({
      [assignableIds[0]]: {
        role: 'viewer',
        actions: ['view'],
      },
      'assignableId4@2.0.0': {
        role: null,
        actions: [],
      },
    });
  });

  test('should return default user permissions if no userAgents', async () => {
    // Arrange
    const pluginName = 'assignables';
    const ctx = generateCtx({
      actions: {
        'users.permissions.getUserAgentPermissions': getUserAgentPermissionsHandle,
        'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
          getAllItemsForTheUserAgentHasPermissionsByTypeHandler,
      },
      pluginName,
    });

    const mockParams = {
      assignables: [{ id: assignableIds[0], asset: 'assetId1' }],
      ctx,
    };
    ctx.meta.userSession.userAgents = [];
    // Act
    const resp = await getUserPermissions(mockParams);

    // Assert
    expect(resp).toEqual({
      [assignableIds[0]]: {
        role: null,
        actions: [],
      },
    });
  });
});
