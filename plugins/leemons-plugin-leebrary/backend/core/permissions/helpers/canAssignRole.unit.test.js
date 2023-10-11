const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const canAssignRole = require('./canAssignRole');

it('should return false if the user does not have permission to assign the new role', () => {
  // Arrange
  const userRole = 'viewer';
  const assignedUserCurrentRole = 'viewer';
  const newRole = 'editor';
  const ctx = generateCtx({});

  // Assign
  const response = canAssignRole({ userRole, assignedUserCurrentRole, newRole, ctx });

  // Assert
  expect(response).toBe(false);
});

it('should return true if the user has permission to assign the new role', () => {
  // Arrange
  const userRole = 'owner';
  const assignedUserCurrentRole = 'viewer';
  const newRole = 'editor';
  const ctx = generateCtx({});

  // Assign
  const response = canAssignRole({ userRole, assignedUserCurrentRole, newRole, ctx });

  // Assert
  expect(response).toBe(true);
});
