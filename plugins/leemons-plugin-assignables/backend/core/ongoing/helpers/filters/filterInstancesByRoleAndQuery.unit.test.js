const { it, expect } = require('@jest/globals');
const { filterInstancesByRoleAndQuery } = require('./filterInstancesByRoleAndQuery');

it('Should call filterInstancesByRoleAndQuery correctly when role and query are provided', () => {
  // Arrange
  const instanceOne = {
    id: 'instanceOne',
    assignable: { asset: { name: 'assetOne' }, id: 'assignableOneId', role: 'task' },
  };
  const instanceTwo = {
    id: 'instanceTwo',
    assignable: {
      asset: { name: 'assetTwo' },
      id: 'assignableTwoId',
      role: 'learningpaths.module',
    },
  };
  const filters = {
    query: 'assetOne',
    role: 'task',
  };

  // Act
  const response = filterInstancesByRoleAndQuery({
    instances: [instanceOne, instanceTwo],
    filters,
  });

  // Assert
  expect(response).toEqual([instanceOne]);
});

it('Should call filterInstancesByRoleAndQuery correctly when only role is provided', () => {
  // Arrange
  const instanceOne = {
    id: 'instanceOne',
    assignable: { asset: { name: 'assetOne' }, id: 'assignableOneId', role: 'task' },
  };
  const instanceTwo = {
    id: 'instanceTwo',
    assignable: { asset: { name: 'assetTwo' }, id: 'assignableTwoId', role: 'content-creator' },
  };
  const filters = {
    role: 'task',
  };

  // Act
  const response = filterInstancesByRoleAndQuery({
    instances: [instanceOne, instanceTwo],
    filters,
  });

  // Assert
  expect(response).toEqual([instanceOne]);
});

it('Should call filterInstancesByRoleAndQuery correctly when only query is provided', () => {
  // Arrange
  const instanceOne = {
    id: 'instanceOne',
    assignable: { asset: { name: 'assetOne' }, id: 'assignableOneId', role: 'task' },
  };
  const instanceTwo = {
    id: 'instanceTwo',
    assignable: { asset: { name: 'assetTwo' }, id: 'assignableTwoId', role: 'module' },
  };
  const filters = {
    query: 'assetOne',
  };

  // Act
  const response = filterInstancesByRoleAndQuery({
    instances: [instanceOne, instanceTwo],
    filters,
  });

  // Assert
  expect(response).toEqual([instanceOne]);
});

it('Should call filterInstancesByRoleAndQuery correctly when no filters are provided', () => {
  // Arrange
  const instanceOne = {
    id: 'instanceOne',
    assignable: { asset: { name: 'assetOne' }, id: 'assignableOneId', role: 'task' },
  };
  const instanceTwo = {
    id: 'instanceTwo',
    assignable: { asset: { name: 'assetTwo' }, id: 'assignableTwoId', role: 'module' },
  };

  // Act
  const response = filterInstancesByRoleAndQuery({
    instances: [instanceOne, instanceTwo],
  });

  // Assert
  expect(response).toEqual([instanceOne, instanceTwo]);
});
