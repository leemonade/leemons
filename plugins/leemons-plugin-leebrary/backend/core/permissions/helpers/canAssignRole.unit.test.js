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
  const userRole = 'editor';
  const newRole = 'editor';
  const ctx = generateCtx({});

  // Assign
  const response = canAssignRole({ userRole, newRole, ctx });

  // Assert
  expect(response).toBe(true);
});

it('should correctly determine if the user is allowed to assing the role to the asignee', () => {
  // Arrange
  const assignedUserCurrentRole = 'viewer';
  const newRole = 'editor';
  const ctx = generateCtx({});

  // Assign
  const response = canAssignRole({ userRole: 'assigner', assignedUserCurrentRole, newRole, ctx });
  const responseTrue = canAssignRole({ userRole: 'editor', newRole, ctx });

  // Assert
  expect(response).toBe(false);
  expect(responseTrue).toBe(true);
});
