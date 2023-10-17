const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getPermissionType } = require('./getPermissionType');

it('Should return the permission type', () => {
  // Arrange
  const ctx = generateCtx({
    pluginName: 'testing',
  });
  const expectedValue = ctx.prefixPN('assignableInstance');

  // Act
  const response = getPermissionType({ ctx });

  // Assert
  expect(response).toBe(expectedValue);
});
