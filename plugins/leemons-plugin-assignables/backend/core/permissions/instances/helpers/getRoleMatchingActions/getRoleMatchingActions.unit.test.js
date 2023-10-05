const { it, expect } = require('@jest/globals');
const { getRoleMatchingActions } = require('./getRoleMatchingActions');

// Test for getRoleMatchingActions function
it('Should return the role name that matches the actions', () => {
  // Arrange
  const actions = ['view', 'edit'];
  const expectedRoleName = 'teacher';

  // Act
  const response = getRoleMatchingActions({ actions });

  // Assert
  expect(response).toBe(expectedRoleName);
});

it('Should return null if no role matches the actions', () => {
  // Arrange
  const actions = ['action3', 'action4'];

  // Act
  const response = getRoleMatchingActions({ actions });

  // Assert
  expect(response).toBeNull();
});
