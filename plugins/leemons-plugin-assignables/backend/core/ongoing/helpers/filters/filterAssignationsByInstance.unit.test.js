const { it, expect, beforeEach } = require('@jest/globals');
const { filterAssignationsByInstance } = require('./filterAssignationsByInstance');

beforeEach(() => jest.resetAllMocks());

it('Should correctly filter assignations by instance', () => {
  // Arrange
  const assignations = [
    { id: 'assignationOne', instance: { id: 'instanceOne' } },
    { id: 'assignationTwo', instance: { id: 'instanceTwo' } },
  ];
  const instances = [{ id: 'instanceOne' }];

  // Act
  const response = filterAssignationsByInstance({ assignations, instances });

  // Assert
  expect(response).toEqual([{ id: 'assignationOne', instance: { id: 'instanceOne' } }]);
});

it('Should return an empty array when there are no matching instances', () => {
  // Arrange
  const assignations = [
    { id: 'assignationOne', instance: { id: 'instanceOne' } },
    { id: 'assignationTwo', instance: { id: 'instanceTwo' } },
  ];
  const instances = [{ id: 'instanceThree' }];

  // Act
  const response = filterAssignationsByInstance({ assignations, instances });

  // Assert
  expect(response).toEqual([]);
});
