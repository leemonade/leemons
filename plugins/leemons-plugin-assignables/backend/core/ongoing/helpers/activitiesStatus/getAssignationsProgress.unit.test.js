const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getAssignationsProgress } = require('./getAssignationsProgress');
const { gradesSchema } = require('../../../../models/grades');

let mongooseConnection;
let disconnectMongoose;

beforeAll(async () => {
  const { mongoose, disconnect } = await createMongooseConnection();

  mongooseConnection = mongoose;
  disconnectMongoose = disconnect;
});

afterAll(async () => {
  await disconnectMongoose();

  mongooseConnection = null;
  disconnectMongoose = null;
});

beforeEach(async () => {
  await mongooseConnection.dropDatabase();
});

it('Should correctly get the progress status for an evaluated assignation', async () => {
  // Arrange
  const instanceOne = {
    id: 'instanceOne',
    assignable: { asset: {}, id: 'assignableOneId', role: 'task' },
    requiresScoring: 0,
    allowFeedback: 1,
    alwaysAvailable: 1,
  };
  const instanceTwo = {
    id: 'instanceTwo',
    assignable: { asset: {}, id: 'assignableTwoId', role: 'task' },
    requiresScoring: 1,
    allowFeedback: 0,
    alwaysAvailable: 1,
  };
  const assignationOne = { id: 'assignationOne', instance: instanceOne };
  const assignationTwo = { id: 'assignationTwo', instance: instanceTwo };
  const assignations = [assignationOne, assignationTwo];
  const instanceSubjectsProgramsAndClasses = {
    instanceOne: {
      subjects: ['subjectOneId', 'subjectTwoId'],
      programs: ['programA'],
      classes: ['classOne'],
    },
    instanceTwo: {
      subjects: ['subjectTwoId', 'subjectThreeId'],
      programs: ['programB'],
      classes: ['classTwoId', 'classThreeId'],
    },
  };
  const dates = {
    instances: {
      instanceOne: { start: new Date('December 31, 1993') },
      instanceTwo: { archived: new Date('December 31, 2000') },
    },
    assignations: {},
  };

  const ctx = generateCtx({
    models: {
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  const mockGrades = [
    {
      id: '1',
      assignation: assignationOne.id,
      subject: instanceSubjectsProgramsAndClasses.instanceOne.subjects[0],
      type: 'main',
      grade: 8.0,
      gradedBy: 'teacherUserOne',
      visibleToStudent: true,
    },
    {
      id: '2',
      assignation: assignationOne.id,
      subject: instanceSubjectsProgramsAndClasses.instanceOne.subjects[1],
      type: 'main',
      grade: 8.0,
      gradedBy: 'teacherUserOne',
      visibleToStudent: true,
    },
    {
      id: '3',
      assignation: assignationTwo.id,
      subject: instanceSubjectsProgramsAndClasses.instanceTwo.subjects[0],
      type: 'main',
      grade: 8.0,
      gradedBy: 'teacherUserOne',
      visibleToStudent: true,
    },
  ];
  await ctx.db.Grades.create(mockGrades);

  // Act
  const response = await getAssignationsProgress({
    dates,
    assignations,
    instanceSubjectsProgramsAndClasses,
    ctx,
  });

  // Assert
  expect(response).toEqual(['evaluated', 'notStarted']);
});

it('Should correctly get the progress status for a not submitted assignation', async () => {
  // Arrange
  const instanceOne = {
    id: 'instanceOne',
    assignable: { asset: {}, id: 'assignableOneId', role: 'task' },
    requiresScoring: 0,
    allowFeedback: 1,
    alwaysAvailable: 1,
  };
  const instanceTwo = {
    id: 'instanceTwo',
    assignable: { asset: {}, id: 'assignableTwoId', role: 'task' },
    requiresScoring: 1,
    allowFeedback: 0,
    alwaysAvailable: 0,
  };
  const assignationOne = { id: 'assignationOne', instance: instanceOne };
  const assignationTwo = { id: 'assignationTwo', instance: instanceTwo };
  const assignations = [assignationOne, assignationTwo];
  const instanceSubjectsProgramsAndClasses = {
    instanceOne: {
      subjects: ['subjectOneId', 'subjectTwoId'],
      programs: ['programA'],
      classes: ['classOne'],
    },
    instanceTwo: {
      subjects: ['subjectTwoId', 'subjectThreeId'],
      programs: ['programB'],
      classes: ['classTwoId', 'classThreeId'],
    },
  };
  const dates = {
    instances: {
      instanceOne: { closed: new Date('December 31, 1993') },
      instanceTwo: { deadline: new Date('December 31, 2000') },
    },
    assignations: {},
  };

  const ctx = generateCtx({
    models: {
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  // Act
  const response = await getAssignationsProgress({
    dates,
    assignations,
    instanceSubjectsProgramsAndClasses,
    ctx,
  });

  // Assert
  expect(response).toEqual(['notSubmitted', 'notSubmitted']);
});

it('Should correctly get the progress status for a finished assignation', async () => {
  // Arrange
  const instanceOne = {
    id: 'instanceOne',
    assignable: { asset: {}, id: 'assignableOneId', role: 'task' },
    requiresScoring: 0,
    allowFeedback: 1,
    alwaysAvailable: 1,
  };
  const assignationOne = { id: 'assignationOne', instance: instanceOne };
  const assignations = [assignationOne];
  const instanceSubjectsProgramsAndClasses = {
    instanceOne: {
      subjects: ['subjectOneId', 'subjectTwoId'],
      programs: ['programA'],
      classes: ['classOne'],
    },
  };
  const dates = {
    instances: {},
    assignations: {
      [assignationOne.id]: {
        start: new Date('October 22, 1993'),
        end: new Date('October 31, 1993'),
      },
    },
  };

  const ctx = generateCtx({
    models: {
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  // Act
  const response = await getAssignationsProgress({
    dates,
    assignations,
    instanceSubjectsProgramsAndClasses,
    ctx,
  });

  // Assert
  expect(response).toEqual(['finished']);
});

it('Should correctly get the progress status for a started assignation', async () => {
  // Arrange
  const instanceOne = {
    id: 'instanceOne',
    assignable: { asset: {}, id: 'assignableOneId', role: 'task' },
    requiresScoring: 0,
    allowFeedback: 1,
    alwaysAvailable: 1,
  };
  const assignationOne = { id: 'assignationOne', instance: instanceOne };
  const assignations = [assignationOne];
  const instanceSubjectsProgramsAndClasses = {
    instanceOne: {
      subjects: ['subjectOneId', 'subjectTwoId'],
      programs: ['programA'],
      classes: ['classOne'],
    },
  };
  const dates = {
    instances: {},
    assignations: {
      [assignationOne.id]: {
        start: new Date('October 22, 1993'),
      },
    },
  };

  const ctx = generateCtx({
    models: {
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  // Act
  const response = await getAssignationsProgress({
    dates,
    assignations,
    instanceSubjectsProgramsAndClasses,
    ctx,
  });

  // Assert
  expect(response).toEqual(['started']);
});
