const { it, expect } = require('@jest/globals');
const { filterAssignationsByStudentDidOpen } = require('./filterAssignationsByStudentDidOpen');

it('Should return all assignations if studentDidOpen is not a boolean', () => {
  // Arrange
  const assignations = [
    { id: 'assignationOne', open: true },
    { id: 'assignationTwo', open: false },
  ];
  const dates = {
    assignations: { assignationOne: { open: true }, assignationTwo: { open: false } },
  };
  const filters = { studentDidOpen: 'true' };

  // Act
  const response = filterAssignationsByStudentDidOpen({ assignations, dates, filters });

  // Assert
  expect(response).toEqual(assignations);
});

it('Should filter assignations by studentDidOpen', () => {
  // Arrange
  const assignations = [
    { id: 'assignationOne', open: true },
    { id: 'assignationTwo', open: false },
  ];
  const dates = {
    assignations: { assignationOne: { open: true }, assignationTwo: { open: false } },
  };
  const filters = { studentDidOpen: true };

  // Act
  const response = filterAssignationsByStudentDidOpen({ assignations, dates, filters });

  // Assert
  expect(response).toEqual([assignations[0]]);
});
