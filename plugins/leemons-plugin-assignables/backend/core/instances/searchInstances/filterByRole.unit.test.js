const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { filterByRole } = require('./filterByRole');

it('Should return filtered assignables by role', () => {
  const ctx = generateCtx({});
  // Arrange
  const assignables = [
    {
      role: 'student',
      assignable: 'assignableId1',
    },
    {
      role: 'teacher',
      assignable: 'assignableId1',
    },
    {
      role: 'student',
      assignable: 'assignableId2',
    },
    {
      role: 'teacher',
      assignable: 'assignableId3',
    },
  ];
  const query = {
    role: 'student',
  };

  // Act
  const response = filterByRole(assignables, query, ctx);

  // Assert
  expect(response).toEqual(['assignableId1', 'assignableId2']);
});

it('should return all assignables if no role is provided in the query', () => {
  const ctx = generateCtx({});

  const assignables = [
    {
      role: 'student',
      assignable: 'assignableId1',
    },
    {
      role: 'teacher',
      assignable: 'assignableId1',
    },
    {
      role: 'student',
      assignable: 'assignableId2',
    },
    {
      role: 'teacher',
      assignable: 'assignableId3',
    },
  ];
  const query = {};

  // Act
  const response = filterByRole(assignables, query, ctx);

  // Assert
  expect(response).toEqual(['assignableId1', 'assignableId2', 'assignableId3']);
});
