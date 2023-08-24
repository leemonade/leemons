const { it, expect } = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { getPermissionType } = require('./getPermissionType');

it('Should return the permission type', () => {
  // Arrange
  const role = 'roleName';

  const ctx = generateCtx({
    pluginName: 'testing',
  });
  const expectedValue = ctx.prefixPN(`assignable.${role}`);

  // Act
  const response = getPermissionType({ role, ctx });

  // Assert
  expect(response).toBe(expectedValue);
});

it('Should throw if no role is provided', () => {
  // Arrange
  const role = null;

  const ctx = generateCtx({
    pluginName: 'testing',
  });

  // Act
  const testFn = () => getPermissionType({ role, ctx });

  // Assert
  expect(testFn).toThrow('The role is required');
});
