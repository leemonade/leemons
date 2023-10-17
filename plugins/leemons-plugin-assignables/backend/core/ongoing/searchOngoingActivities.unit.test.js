const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

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
const {
  applyOffsetAndLimit,
  sortInstancesByDates,
} = require('./helpers/sorts');

beforeEach(() => jest.resetAllMocks());

it('Should correctly return ongoing activities for a teacher', async () => {
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
  getInstanceSubjectsProgramsAndClasses.mockResolvedValue(
    instanceSubjectsProgramsAndClasses
  );
  filterInstancesByProgramAndSubjects.mockReturnValue([
    instanceOne,
    instanceTwo,
  ]);
  getActivitiesDates.mockResolvedValue(mockDates);
  filterInstancesByStatusAndArchived.mockReturnValue([
    instanceOne,
    instanceTwo,
  ]);
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
  expect(applyOffsetAndLimit).toBeCalledWith(
    [instanceTwo.id, instanceOne.id],
    query
  );
  expect(response).toEqual([instanceTwo.id, instanceOne.id]);
  expect(getStudentAssignations).not.toBeCalled();
});

it('Should correctly return ongoing activities for a student', async () => {
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
    allowFeedback: 1,
    created_at: '1990-01-01',
  };
  const instanceTwo = {
    id: 'instanceTwo',
    assignable: { asset: {}, id: 'assignableTwoId', role: 'task' },
    allowFeedback: 1,
    created_at: '1990-01-02',
  };
  const assignationOne = {
    id: 'assignationOne',
    instance: instanceOne,
    user: 'userOne',
  };
  const assignationTwo = {
    id: 'assignationTwo',
    instance: instanceTwo,
    user: 'userOne',
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
      [instanceTwo.id]: { archived: new Date('December 31, 2000') },
    },
    assignations: {},
  };
  let filterAssignationsByInstanceCounter = 0;

  getStudentAssignations.mockResolvedValue([assignationOne, assignationTwo]);
  filterInstancesByRoleAndQuery.mockReturnValue([instanceOne, instanceTwo]);
  filterInstancesByNotModule.mockReturnValue([instanceOne, instanceTwo]);
  getInstanceSubjectsProgramsAndClasses.mockResolvedValue(
    instanceSubjectsProgramsAndClasses
  );
  filterInstancesByProgramAndSubjects.mockReturnValue([
    instanceOne,
    instanceTwo,
  ]);
  filterAssignationsByInstance.mockImplementation(() => {
    filterAssignationsByInstanceCounter++;
    if (filterAssignationsByInstanceCounter === 1)
      return [assignationOne, assignationTwo];
    return [assignationOne];
  });
  getActivitiesDates.mockResolvedValue(mockDates);
  filterInstancesByStatusAndArchived.mockReturnValue([instanceOne]);
  filterAssignationsByProgress.mockResolvedValue([assignationOne]);
  sortInstancesByDates.mockReturnValue([instanceOne]);
  applyOffsetAndLimit.mockReturnValue([instanceOne.id]);

  // Act
  const response = await searchOngoingActivities({ query, ctx });

  // Assert
  expect(getStudentAssignations).toBeCalledWith({ ctx });
  expect(filterInstancesByRoleAndQuery).toBeCalledWith({
    instances: [assignationOne.instance, assignationTwo.instance],
    filters: query,
  });
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
  expect(filterAssignationsByInstance).nthCalledWith(1, {
    assignations: [assignationOne, assignationTwo],
    instances: [instanceOne, instanceTwo],
  });
  expect(getActivitiesDates).toBeCalledWith({
    instances: [instanceOne, instanceTwo],
    assignations: [assignationOne, assignationTwo],
    filters: { ...query, studentCanSee: true },
    ctx,
  });
  expect(filterInstancesByStatusAndArchived).toBeCalledWith({
    instances: [instanceOne, instanceTwo],
    filters: query,
    dates: mockDates,
    hideNonVisible: true,
  });
  expect(filterAssignationsByInstance).nthCalledWith(2, {
    assignations: [assignationOne, assignationTwo],
    instances: [instanceOne],
  });
  expect(filterAssignationsByProgress).toBeCalledWith({
    assignations: [assignationOne],
    dates: mockDates,
    filters: query,
    instanceSubjectsProgramsAndClasses,
    ctx,
  });
  expect(sortInstancesByDates).toBeCalledWith({
    instances: [instanceOne],
    dates: mockDates,
    filters: query,
  });
  expect(applyOffsetAndLimit).toBeCalledWith([instanceOne.id], query);
  expect(response).toEqual([instanceOne.id]);
  expect(getTeacherInstances).not.toBeCalled();
});
