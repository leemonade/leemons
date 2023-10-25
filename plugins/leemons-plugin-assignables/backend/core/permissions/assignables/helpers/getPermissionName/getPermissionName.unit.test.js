const { it, expect } = require('@jest/globals');

const { generateCtx } = require('@leemons/testing');

const { getPermissionName } = require('./getPermissionName');

it('Should return the permission name without prefix', () => {
  // Arrange
  const id = 'ThisIstheId';
  const expectedValue = `assignable.${id}`;

  const ctx = generateCtx({
    pluginName: 'testing',
  });

  // Act
  const response = getPermissionName({ id, ctx });

  // Assert
  expect(response).toBe(expectedValue);
});

it('Should return the permission name with prefix', () => {
  // Arrange
  const id = 'ThisIstheId';

  const ctx = generateCtx({
    pluginName: 'testing',
  });

  const expectedValue = ctx.prefixPN(`assignable.${id}`);

  // Act
  const response = getPermissionName({ id, prefix: true, ctx });

  // Assert
  expect(response).toBe(expectedValue);
});

it('Should throw if no id is provided', () => {
  // Arrange
  const id = null;

  const ctx = generateCtx({
    pluginName: 'testing',
  });

  // Act
  const testFn = () => getPermissionName({ id, prefix: true, ctx });

  // Assert
  expect(testFn).toThrow('The assignable id is required');
});
