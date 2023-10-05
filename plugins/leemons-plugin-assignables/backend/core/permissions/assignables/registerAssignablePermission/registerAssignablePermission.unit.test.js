const { it, expect } = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { registerAssignablePermission } = require('./registerAssignablePermission');

it('Should register the permission', async () => {
  // Arrange
  const id = 'assignableId';
  const role = 'assignableRole';

  const ctx = generateCtx({
    actions: {
      'users.permissions.addItem': (params) => params,
    },
  });

  // Act
  const response = await registerAssignablePermission({ id, role, ctx });

  // Assert
  expect(response.item).toBe(id);
  expect(response.type).toContain(role);
  expect(response.data).toHaveProperty('permissionName');
  expect(response.data).toHaveProperty('actionNames');
  expect(response.isCustomPermission).toBeTruthy();
});

it('Should throw if a required param is not provided', async () => {
  // Arrange
  const id = 'assignableId';
  const role = 'assignableRole';
  const expectedError = 'Error registering permission: The id and role params are required';

  const ctx = generateCtx({});

  // Act
  const noIdTestFn = () => registerAssignablePermission({ id: undefined, role, ctx });
  const noRoleTestFn = () => registerAssignablePermission({ id, role: undefined, ctx });

  // Assert
  expect(noIdTestFn).rejects.toThrowError(expectedError);
  expect(noRoleTestFn).rejects.toThrowError(expectedError);
});
