const { it, expect } = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const searchOngoingActivities = require('./searchOngoingActivities');

jest.mock('./helpers/activitiesData');
jest.mock('./helpers/filters');
jest.mock('./helpers/sorts');
const {
  getActivitiesDates,
  getInstanceSubjectsProgramsAndClasses,
  getStudentAssignations,
  getTeacherInstances,
} = require('./helpers/activitiesData');
const {
  filterAssignationsByInstance,
  filterAssignationsByProgress,
  filterInstancesByProgramAndSubjects,
  filterInstancesByRoleAndQuery,
  filterInstancesByStatusAndArchived,
  filterInstancesByNotModule,
} = require('./helpers/filters');
const { applyOffsetAndLimit, sortInstancesByDates } = require('./helpers/sorts');

it('Should return instances for teacher correctly', async () => {
  // Arrange
  const query = {
    isTeacher: 'true',
    isArchived: 'false',
    sort: 'assignation',
    offset: '0',
    limit: '10',
  };
  const ctx = generateCtx({});
  const instanceOne = {
    id: 'instanceOne',
    assignable: { asset: {}, id: 'assignableOneId', role: 'task' },
  };
  const instanceTwo = {
    id: 'instanceTwo',
    assignable: undefined,
  };
  const instanceSubjectsProgramsAndClasses = {
    [instanceOne.id]: {
      subjects: ['subjectOneId'],
      programs: ['programA'],
      classes: ['classOne'],
    },
    [instanceTwo.id]: {
      subjects: ['subjectTwoId'],
      programs: ['programB'],
      classes: ['classTwoId', 'classThreeId'],
    },
  };

  getTeacherInstances.mockResolvedValue([instanceOne, instanceTwo]);
  filterInstancesByNotModule.mockResolvedValue([instanceOne, instanceTwo]);
  filterInstancesByRoleAndQuery.mockResolvedValue([instanceOne, instanceTwo]);
  getInstanceSubjectsProgramsAndClasses.mockResolvedValue(instanceSubjectsProgramsAndClasses);
  filterInstancesByProgramAndSubjects.mockResolvedValue([instanceOne, instanceTwo]);
  getActivitiesDates.mockResolvedValue({
    instances: { [instanceOne.id]: { start: new Date() } },
    assignations: {},
  });

  // Act
  try {
    const response = await searchOngoingActivities({ query, ctx });
  } catch (error) {
    console.log('Work in progress');
  }

  // Assert
  expect(getTeacherInstances).toBeCalledWith({ ctx });
  expect(filterInstancesByNotModule).toBeCalledWith({
    instances: [instanceOne, instanceTwo],
    filters: query,
  });
  expect(getInstanceSubjectsProgramsAndClasses).toBeCalledWith({
    instances: [instanceOne, instanceTwo],
    ctx,
  });
  expect(filterInstancesByProgramAndSubjects).toBeCalledWith({
    instances: [instanceOne, instanceTwo],
    filters: query,
    instanceSubjectsProgramsAndClasses,
  });
  expect(getActivitiesDates).toBeCalledWith({
    instances: [instanceOne, instanceTwo],
    filters: query,
    ctx,
  });
});
