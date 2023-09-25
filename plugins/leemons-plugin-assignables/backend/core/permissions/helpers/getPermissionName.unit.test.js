const { generateCtx } = require('leemons-testing');

const { getPermissionName } = require('./getPermissionName');

describe('getPermissionName', () => {
  it('should return the correct permission name without prefix', () => {
    // Arrange
    const assignableId = 'testId';
    const ctx = generateCtx({});

    // Act
    const result = getPermissionName({ assignableId, ctx });

    // Assert
    expect(result).toBe('assignable.testId');
  });

  it('should return the correct permission name with prefix', () => {
    // Arrange
    const assignableId = 'testId';
    const prefix = true;
    const ctx = generateCtx({
      pluginName: 'testPlugin',
    });

    // Act
    const result = getPermissionName({ assignableId, prefix, ctx });

    // Assert
    expect(result).toBe('testPlugin.assignable.testId');
  });
});
