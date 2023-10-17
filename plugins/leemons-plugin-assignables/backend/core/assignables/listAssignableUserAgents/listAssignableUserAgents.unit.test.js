const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { listAssignableUserAgents } = require('./listAssignableUserAgents');
const { getAssignable } = require('../getAssignable');
const {
  getUserPermission,
} = require('../../permissions/assignables/users/getUserPermission');

// Mocking the external function calls
jest.mock('../getAssignable');

jest.mock('../../permissions/assignables/users/getUserPermission');

const findUserAgentsWithPermissionHandler = jest.fn();
const getUserAgentsInfoHandler = jest.fn();

describe('listAssignableUserAgents', () => {
  beforeEach(() => {
    getAssignable.mockReset();
    getUserPermission.mockReset();
  });

  it('should return user agents for given assignable id', async () => {
    // Arrange
    const assignableId = 'assignable1';
    const ctx = generateCtx({
      actions: {
        'users.permissions.findUserAgentsWithPermission':
          findUserAgentsWithPermissionHandler,
        'users.users.getUserAgentsInfo': getUserAgentsInfoHandler,
      },
    });
    const expectedUserPermission = { role: 'student', action: 'view' };
    getAssignable.mockResolvedValue();
    findUserAgentsWithPermissionHandler.mockResolvedValue([
      'userAgentId1',
      'userAgentId2',
    ]);
    getUserAgentsInfoHandler.mockResolvedValue([
      { id: 'userAgentId1' },
      { id: 'userAgentId2' },
    ]);
    getUserPermission.mockResolvedValue(expectedUserPermission);

    // Act
    const result = await listAssignableUserAgents({ assignableId, ctx });

    // Assert
    expect(getAssignable).toHaveBeenCalledWith({ id: assignableId, ctx });
    expect(findUserAgentsWithPermissionHandler).toHaveBeenCalledWith({
      permissions: { permissionName: 'assignable.assignable1' },
    });
    expect(getUserPermission).toHaveBeenCalledWith({ assignableId, ctx });
    expect(result).toEqual([
      {
        userAgent: 'userAgentId1',
        ...expectedUserPermission,
      },
      {
        userAgent: 'userAgentId2',
        ...expectedUserPermission,
      },
    ]);
  });
});
