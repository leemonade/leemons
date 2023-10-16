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

it('Should correctly return instances for a teacher', async () => {
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
    created_at: '1990-01-01',
  };
  const instanceTwo = {
    id: 'instanceTwo',
    assignable: undefined,
    created_at: '1990-01-02',
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
  const mockDates = {
    instances: {
      [instanceOne.id]: { start: new Date('December 31, 1993') },
      [instanceTwo.id]: { deadline: new Date('December 31, 2000') },
    },
    assignations: {},
  };

  getTeacherInstances.mockResolvedValue([instanceOne, instanceTwo]);
  filterInstancesByNotModule.mockReturnValue([instanceOne, instanceTwo]);
  filterInstancesByRoleAndQuery.mockReturnValue([instanceOne, instanceTwo]);
  getInstanceSubjectsProgramsAndClasses.mockResolvedValue(instanceSubjectsProgramsAndClasses);
  filterInstancesByProgramAndSubjects.mockReturnValue([instanceOne, instanceTwo]);
  getActivitiesDates.mockResolvedValue(mockDates);
  filterInstancesByStatusAndArchived.mockReturnValue([instanceOne, instanceTwo]);
  sortInstancesByDates.mockReturnValue([instanceTwo, instanceOne]);
  applyOffsetAndLimit.mockReturnValue([instanceTwo.id, instanceOne.id]);

  // Act
  const response = await searchOngoingActivities({ query, ctx });

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
  expect(filterInstancesByStatusAndArchived).toBeCalledWith({
    instances: [instanceOne, instanceTwo],
    filters: query,
    dates: mockDates,
  });
  expect(sortInstancesByDates).toBeCalledWith({
    instances: [instanceOne, instanceTwo],
    dates: mockDates,
    filters: query,
  });
  expect(applyOffsetAndLimit).toBeCalledWith([instanceTwo.id, instanceOne.id], query);
  expect(response).toEqual([instanceTwo.id, instanceOne.id]);
  expect(getStudentAssignations).not.toBeCalled();
});

it.skip('Should correctly return assignations for a student', async () => {
  // Arrange
  const query = {
    isTeacher: 'false',
    isArchived: 'false',
    sort: 'assignation',
    offset: '0',
    limit: '10',
    programs: '["programId"]',
  };
  const ctx = generateCtx({});
  const instanceOne = {
    id: 'instanceOne',
    assignable: { asset: {}, id: 'assignableOneId', role: 'task' },
    created_at: '1990-01-01',
  };
  const instanceTwo = {
    id: 'instanceTwo',
    assignable: undefined,
    created_at: '1990-01-02',
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
  const mockDates = {
    instances: {
      [instanceOne.id]: { start: new Date('December 31, 1993') },
      [instanceTwo.id]: { deadline: new Date('December 31, 2000') },
    },
    assignations: {},
  };

  getStudentAssignations.mockResolvedValue([instanceOne, instanceTwo]);
  // filterInstancesByNotModule.mockReturnValue([instanceOne, instanceTwo]);
  // filterInstancesByRoleAndQuery.mockReturnValue([instanceOne, instanceTwo]);
  // getInstanceSubjectsProgramsAndClasses.mockResolvedValue(instanceSubjectsProgramsAndClasses);
  // filterInstancesByProgramAndSubjects.mockReturnValue([instanceOne, instanceTwo]);
  // getActivitiesDates.mockResolvedValue(mockDates);
  // filterInstancesByStatusAndArchived.mockReturnValue([instanceOne, instanceTwo]);
  // sortInstancesByDates.mockReturnValue([instanceTwo, instanceOne]);
  // applyOffsetAndLimit.mockReturnValue([instanceTwo.id, instanceOne.id]);

  // Act
  const response = await searchOngoingActivities({ query, ctx });

  // Assert
  expect(getStudentAssignations).toBeCalledWith({ ctx });
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
  expect(filterInstancesByStatusAndArchived).toBeCalledWith({
    instances: [instanceOne, instanceTwo],
    filters: query,
    dates: mockDates,
  });
  expect(sortInstancesByDates).toBeCalledWith({
    instances: [instanceOne, instanceTwo],
    dates: mockDates,
    filters: query,
  });
  expect(applyOffsetAndLimit).toBeCalledWith([instanceTwo.id, instanceOne.id], query);
  expect(response).toEqual([instanceTwo.id, instanceOne.id]);
  expect(getTeacherInstances).not.toBeCalled();
});
