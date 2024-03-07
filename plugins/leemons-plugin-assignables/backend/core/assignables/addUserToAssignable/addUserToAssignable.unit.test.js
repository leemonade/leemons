const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { addUserToAssignable } = require('./addUserToAssignable');
const { getAssignable } = require('../getAssignable');
const {
  getUserPermission,
} = require('../../permissions/assignables/users/getUserPermission');
const {
  addPermissionToUser,
} = require('../../permissions/assignables/users/addPermissionToUser');

jest.mock('../getAssignable');
jest.mock('../../permissions/assignables/users/getUserPermission');
jest.mock('../../permissions/assignables/users/addPermissionToUser');

it('Should add user to assignable', async () => {
  // Arrange
  const ctx = generateCtx({});
  const assignableId = 'assignableId';
  const userAgents = ['userAgent1', 'userAgent2'];
  const assignerRole = 'editor';
  const role = 'student';
  const actions = ['edit', 'view', 'assign'];

  getAssignable.mockReturnValue();
  getUserPermission.mockReturnValue({ role: assignerRole });
  addPermissionToUser.mockReturnValue({ userAgents, role, actions });

  // Act
  const response = await addUserToAssignable({
    assignableId,
    userAgents,
    role,
    ctx,
  });

  // Assert
  expect(response).toEqual({ userAgents, role, actions });
});

it('Should throw Error if user has no permission', async () => {
  // Arrange
  const ctx = generateCtx({});
  const assignableId = 'assignableId';
  const userAgents = ['userAgent1', 'userAgent2'];
  const role = 'student';

  const errorMessage = 'Error Message';
  getAssignable.mockImplementation(() => {
    throw Error(errorMessage);
  });

  // Act
  const testFunc = () =>
    addUserToAssignable({ assignableId, userAgents, role, ctx });

  // Assert
  await expect(testFunc).rejects.toThrow(
    /does not exist or you don't have access to it/
  );
});

it('Should throw Error if role cannot assign', async () => {
  // Arrange
  const ctx = generateCtx({});
  const assignableId = 'assignableId';
  const userAgents = ['userAgent1', 'userAgent2'];
  const assignerRole = 'student';
  const role = 'student';
  const actions = ['edit', 'view', 'assign'];

  getAssignable.mockReturnValue();
  getUserPermission.mockReturnValue({ role: assignerRole });
  addPermissionToUser.mockReturnValue({ userAgents, role, actions });

  // Act
  const testFunc = () =>
    addUserToAssignable({ assignableId, userAgents, role, ctx });

  // Assert
  await expect(testFunc).rejects.toThrow(
    /User cannot assign to assignable with role/
  );
});
