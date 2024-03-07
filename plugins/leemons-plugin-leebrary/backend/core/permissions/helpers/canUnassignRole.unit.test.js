const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const canUnassignRole = require('./canUnassignRole');

it('should return false if the user does not have permission to unassign the role', () => {
  // Arrange
  const userRole = 'assigner';
  const assignedUserCurrentRole = 'viewer';
  const ctx = generateCtx({});

  // Assign
  const response = canUnassignRole({ userRole, assignedUserCurrentRole, ctx });

  // Assert
  expect(response).toBe(false);
});

it('should return true if the user has permission to unassign the role', () => {
  // Arrange
  const userRole = 'editor';
  const assignedUserCurrentRole = 'commentor';
  const ctx = generateCtx({});

  // Assign
  const response = canUnassignRole({ userRole, assignedUserCurrentRole, ctx });

  // Assert
  expect(response).toBe(true);
});

it('should correctly determine if the user is allowed to assing the role to the asignee', () => {
  // Arrange
  const userRole = 'commentor';
  const ctx = generateCtx({});

  // Assign
  const response = canUnassignRole({
    userRole,
    assignedUserCurrentRole: 'editor',
    ctx,
  });
  const responseTrue = canUnassignRole({ userRole, ctx });

  // Assert
  expect(response).toBe(false);
  expect(responseTrue).toBe(true);
});
