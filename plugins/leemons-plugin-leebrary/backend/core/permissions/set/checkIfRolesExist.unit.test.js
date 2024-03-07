const { it, expect, beforeEach } = require('@jest/globals');
const { LeemonsError } = require('@leemons/error');
const { generateCtx } = require('@leemons/testing');

const { checkIfRolesExist } = require('./checkIfRolesExist');
const validateRole = require('../helpers/validateRole');

// MOCKS
jest.mock('../helpers/validateRole');

beforeEach(() => jest.resetAllMocks());

it('should throw error when roles are invalid', () => {
  // Arrange
  const canAccess = [{ userAgent: 'userAgentId', role: 'admin' }];
  const ctx = generateCtx({});
  validateRole.mockReturnValue(false);

  // Act
  try {
    checkIfRolesExist({ canAccess, ctx });
  } catch (error) {
    // Assert
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(412);
    expect(validateRole).toHaveBeenCalled();
  }
});

it('should not throw when roles are valid', () => {
  // Arrange
  const canAccess = [];
  const permissions = { viewer: [], editor: [], assigner: [] };
  const ctx = generateCtx({});
  validateRole.mockReturnValue(true);

  // Act
  const testFn = () => checkIfRolesExist({ canAccess, permissions, ctx });

  // Assert
  expect(testFn).not.toThrow();
});
