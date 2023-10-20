const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getPermissionName } = require('./getPermissionName');

it('Should return the permission name without prefix', () => {
  // Arrange
  const assignableInstance = 'assignableInstance';
  const assignable = 'assignableId';
  const expectedValue = `assignable.${assignable}.assignableInstance.${assignableInstance}`;

  const ctx = generateCtx({
    pluginName: 'testing',
  });

  // Act
  const response = getPermissionName({ assignableInstance, assignable, ctx });

  // Assert
  expect(response).toBe(expectedValue);
});

it('Should return the permission name without prefix', () => {
  // Arrange
  const assignableInstance = 'assignableInstance';
  const expectedValue = `assignableInstance.${assignableInstance}`;

  const ctx = generateCtx({
    pluginName: 'testing',
  });

  // Act
  const response = getPermissionName({ assignableInstance, ctx });

  // Assert
  expect(response).toBe(expectedValue);
});

it('Should return the permission name with prefix', () => {
  // Arrange
  const assignableInstance = 'assignableInstanceId';

  const ctx = generateCtx({
    pluginName: 'testing',
  });

  const expectedValue = ctx.prefixPN(
    `assignableInstance.${assignableInstance}`
  );

  // Act
  const response = getPermissionName({ assignableInstance, prefix: true, ctx });

  // Assert
  expect(response).toBe(expectedValue);
});
