const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

// MOCKS
jest.mock('../activitiesStatus');
const { getAssignationsProgress } = require('../activitiesStatus');

const {
  filterAssignationsByProgress,
} = require('./filterAssignationsByProgress');

it('Should call filterAssignationsByProgress correctly', async () => {
  // Arrange
  const ctx = generateCtx({});
  const assignationOne = { id: 'assignationOne' };
  const assignationTwo = { id: 'assignationTwo' };
  const assignations = [assignationOne, assignationTwo];
  const filters = { progress: 'finished' };
  const instanceSubjectsProgramsAndClasses = {
    instanceOne: {
      subjects: ['subjectOneId'],
      programs: ['programA'],
      classes: ['classOne'],
    },
    instanceTwo: {
      subjects: ['subjectTwoId'],
      programs: ['programB'],
      classes: ['classTwoId', 'classThreeId'],
    },
  };
  const dates = {
    instances: {
      instanceOne: { start: new Date('December 31, 1993') },
      instanceTwo: { closed: new Date('December 31, 2000') },
    },
    assignations: {
      instanceTwo: {
        start: new Date('October 22, 2000'),
        finished: new Date('December 31, 2000'),
      },
    },
  };

  getAssignationsProgress.mockResolvedValue(['started', 'finished']);
  // Act
  const response = await filterAssignationsByProgress({
    assignations,
    filters,
    dates,
    instanceSubjectsProgramsAndClasses,
    ctx,
  });

  // Assert
  expect(getAssignationsProgress).toBeCalledWith({
    dates,
    assignations,
    instanceSubjectsProgramsAndClasses,
    ctx,
  });
  expect(response).toEqual([{ id: 'assignationTwo' }]);
});

it('Should not filter if the progress filter value is not supported or not passed', async () => {
  // Arrange
  const ctx = generateCtx({});
  const assignations = [{ id: 'assignationOne' }, { id: 'assignationTwo' }];
  const filters = { progress: 'notSupportedValue' };
  // Act
  const response = await filterAssignationsByProgress({
    assignations,
    filters,
    ctx,
  });
  // Assert
  expect(response).toEqual(assignations);
});
