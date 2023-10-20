const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { removeUserFromAssignable } = require('./removeUserFromAssignable');
const { getAssignable } = require('../getAssignable');
const {
  getUserPermission,
} = require('../../permissions/assignables/users/getUserPermission');
const {
  removePermissionFromUser,
} = require('../../permissions/assignables/users/removePermissionFromUser');

// Mocking the external function calls
jest.mock('../getAssignable');
jest.mock('../../permissions/assignables/users/getUserPermission');
jest.mock('../../permissions/assignables/users/removePermissionFromUser');

const getUserAgentsInfoHandle = jest.fn();

const userAgents = ['userAgentId2'];

describe('removeUserFromAssignable', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should remove user from assignable', async () => {
    // Arrange
    const assignableId = 'assignable1';
    const actions = ['edit', 'view', 'assign'];
    const ctx = generateCtx({
      actions: {
        'users.users.getUserAgentsInfo': getUserAgentsInfoHandle,
      },
    });
    getAssignable.mockResolvedValue({ id: assignableId });
    getUserPermission
      .mockResolvedValueOnce({ role: 'editor' })
      .mockResolvedValue({ role: 'student' });
    getUserAgentsInfoHandle.mockResolvedValue(userAgents);
    removePermissionFromUser.mockResolvedValue({ userAgents, actions });

    // Act
    const result = await removeUserFromAssignable({
      assignableId,
      userAgents,
      ctx,
    });

    // Assert
    expect(getAssignable).toHaveBeenCalledWith({ id: assignableId, ctx });
    expect(getUserPermission).toHaveBeenNthCalledWith(1, {
      assignableId,
      ctx,
    });
    expect(getUserPermission).toHaveBeenLastCalledWith({
      assignableId,
      ctx: {
        ...ctx,
        meta: {
          ...ctx.meta,
          userSession: {
            ...ctx.meta.userSession,
            userAgents: ['userAgentId2'],
          },
        },
      },
    });
    expect(removePermissionFromUser).toHaveBeenCalledWith({
      assignable: { id: assignableId },
      userAgent: 'userAgentId2',
      ctx,
    });
    expect(result).toEqual([{ userAgents, actions }]);
  });

  it('should throw Error if user does not have permission to assignable', async () => {
    // Arrange
    const assignableId = 'assignable1';
    const ctx = generateCtx({
      actions: {
        'users.users.getUserAgentsInfo': getUserAgentsInfoHandle,
      },
    });
    getAssignable.mockResolvedValue({ id: assignableId });
    getUserPermission
      .mockResolvedValueOnce({ role: 'student' })
      .mockResolvedValue({ role: 'student' });
    getUserAgentsInfoHandle.mockResolvedValue(userAgents);

    // Act
    const testFunc = () =>
      removeUserFromAssignable({ assignableId, userAgents, ctx });

    // Assert
    await expect(testFunc).rejects.toThrow(
      /User cannot remove from assignable with role/
    );
    expect(removePermissionFromUser).not.toBeCalled();
  });

  it('should throw Error if user cannot remove from assignable', async () => {
    // Arrange
    const assignableId = 'assignable1';
    const ctx = generateCtx({
      actions: {
        'users.users.getUserAgentsInfo': getUserAgentsInfoHandle,
      },
    });

    getAssignable.mockResolvedValue({ id: assignableId });
    // getAssignable.mockImplementation(() => {
    //   throw new Error('error');
    // });

    // Act
    const testFunc = () =>
      removeUserFromAssignable({ assignableId, userAgents, ctx });

    // Assert
    await expect(testFunc).rejects.toThrow(
      /does not exist or you don't have access to it/
    );
  });
});
