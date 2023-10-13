const { it, expect } = require('@jest/globals');

const { filterInstancesByNotModule } = require('./filterInstancesByNotModule');

it('Should call filterInstancesByNotModule correctly', () => {
  // Arrange
  const instanceOne = {
    id: 'instanceOne',
    assignable: { asset: {}, id: 'assignableOneId', role: 'task' },
    metadata: { module: { type: 'module' } },
  };
  const instanceTwo = {
    id: 'instanceTwo',
    assignable: undefined,
    metadata: {},
  };
  const query = {
    isTeacher: 'true',
    isArchived: 'false',
    sort: 'assignation',
    offset: '0',
    limit: '10',
  };

  // Act
  const response = filterInstancesByNotModule({
    instances: [instanceOne, instanceTwo],
    filters: query,
  });

  // Assert
  expect(response).toEqual([instanceTwo]);
});

it('Should call filterInstancesByNotModule correctly', () => {
  // Arrange
  const instanceOne = {
    id: 'instanceOne',
    assignable: { asset: {}, id: 'assignableOneId', role: 'task' },
    metadata: { module: { type: 'module' } },
  };
  const instanceTwo = {
    id: 'instanceTwo',
    assignable: undefined,
    metadata: {},
  };

  // Act
  const response = filterInstancesByNotModule({
    instances: [instanceOne, instanceTwo],
    filters: { role: 'learningpaths.module' },
  });

  // Assert
  expect(response).toEqual([instanceOne, instanceTwo]);
});
