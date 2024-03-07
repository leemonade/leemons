const { beforeEach, describe, test, expect } = require('@jest/globals');

const { generateCtx } = require('@leemons/testing');

const { getTeacherPermission } = require('./getTeacherPermission');

const { listAssignableClasses } = require('../../../../classes/listAssignableClasses');

jest.mock('../../../../classes/listAssignableClasses');

const getUserAgentPermissionsHandle = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getTeacherPermission function', () => {
  test('should return teacher permissions successfully', async () => {
    // Arrange
    const pluginName = 'assignables';
    const ctx = generateCtx({
      actions: {
        'users.permissions.getUserAgentPermissions': getUserAgentPermissionsHandle,
      },
      pluginName,
    });
    const assignableId = 'assignableId';

    listAssignableClasses.mockResolvedValue([{ class: 'classId1' }, { class: 'classId2' }]);
    getUserAgentPermissionsHandle.mockResolvedValue(['teacherPermission']);

    const mockParams = {
      assignableId,
      ctx,
    };

    // Act
    const resp = await getTeacherPermission(mockParams);

    // Assert
    expect(listAssignableClasses).toHaveBeenCalledWith({
      id: assignableId,
      ctx,
    });
    expect(getUserAgentPermissionsHandle).toHaveBeenCalledWith({
      query: {
        permissionName: ['academic-portfolio.class.classId1', 'academic-portfolio.class.classId2'],
        actionName: 'edit',
      },
      userAgent: ctx.meta.userSession.userAgents,
    });
    expect(resp).toEqual([
      {
        actionNames: ['view', 'edit'],
      },
    ]);
  });

  test('should return empty array if is not teacher', async () => {
    // Arrange
    const pluginName = 'assignables';
    const ctx = generateCtx({
      actions: {
        'users.permissions.getUserAgentPermissions': getUserAgentPermissionsHandle,
      },
      pluginName,
    });
    const assignableId = 'assignableId';

    listAssignableClasses.mockResolvedValue([{ class: 'classId1' }, { class: 'classId2' }]);
    getUserAgentPermissionsHandle.mockResolvedValue([]);

    const mockParams = {
      assignableId,
      ctx,
    };

    // Act
    const resp = await getTeacherPermission(mockParams);

    // Assert
    expect(listAssignableClasses).toHaveBeenCalledWith({
      id: assignableId,
      ctx,
    });
    expect(resp).toEqual([]);
  });
});
