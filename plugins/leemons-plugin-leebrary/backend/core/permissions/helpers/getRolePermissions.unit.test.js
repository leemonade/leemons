const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');

const getRolePermissions = require('./getRolePermissions');
const { rolesPermissions } = require('../../../config/constants');

it('Should get role permissions correctly', () => {
  // Arrange
  const role = 'editor';

  const ctx = generateCtx({});

  // Act
  const response = getRolePermissions({ role, ctx });

  // Assert
  expect(response).toBe(rolesPermissions.editor);
});

it('Should throw if an invalid role is passed', () => {
  const role = 'invalid';

  const ctx = generateCtx({});

  // Act
  const testFnToThrow = () => getRolePermissions({ role, ctx });

  // Assert
  try {
    testFnToThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(412);
    expect(error.message).toEqual(expect.stringContaining(role));
  }
});

it('Should set noPermission as the default role when not passed', () => {
  const ctx = generateCtx({});

  // Act
  const response = getRolePermissions({ ctx });

  // Assert
  expect(response).toBe(rolesPermissions.noPermission);
});
