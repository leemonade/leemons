const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { filterByGraded } = require('./filterByGraded');
const { assignationsSchema } = require('../../../models/assignations');
const { getAssignationObject } = require('../../../__fixtures__/getAssignationObject');

const { getInstancesSubjects } = require('./getInstancesSubjects');
const { getGrade } = require('../../grades/getGrade');

jest.mock('./getInstancesSubjects');
jest.mock('../../grades/getGrade');

const assignation = getAssignationObject();
const assignations = [
  { ...assignation, id: 'assignationId1', instance: 'instanceId1' },
  { ...assignation, id: 'assignationId2', instance: 'instanceId2' },
  { ...assignation, id: 'assignationId3', instance: 'instanceId3' },
];

let mongooseConnection;
let disconnectMongoose;
let ctx;

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
  jest.resetAllMocks();

  ctx = generateCtx({
    models: {
      Assignations: newModel(mongooseConnection, 'Assigntions', assignationsSchema),
    },
  });
  await ctx.tx.db.Assignations.create(assignations);
});

describe('filterByGraded when rule is not Teacher', () => {
  // Arrange
  const isTeacher = false;
  const objects = assignations;

  it('Should return instances if query.evaluated is undefined', async () => {
    // Arrange
    const query = {};

    // Act
    const response = await filterByGraded({ objects, query, isTeacher, ctx });

    // Assert
    expect(getInstancesSubjects).not.toBeCalled();
    expect(getGrade).not.toBeCalled();
    expect(response).toEqual(['instanceId1', 'instanceId2', 'instanceId3']);
  });

  it('Should return instances if query.evaluated is false', async () => {
    // Arrange
    getGrade
      .mockReturnValueOnce([
        {
          assignation: 'assignationId1',
          subject: 'subjectId1',
          type: 'main',
          grade: 7,
          visibleToStudent: true,
          gradedBy: 'teacher-0',
        },
      ])
      .mockReturnValueOnce([
        {
          assignation: 'assignationId2',
          subject: 'subjectId2',
          type: 'main',
          grade: 9,
          visibleToStudent: true,
          gradedBy: 'teacher-1',
        },
      ])
      .mockReturnValueOnce([]);

    getInstancesSubjects.mockReturnValue({
      instanceId1: ['subjectId1'],
      instanceId2: ['subjectId2'],
      instanceId3: ['subjectId3'],
    });

    const query = { evaluated: false };

    // Act
    const response = await filterByGraded({ objects, query, isTeacher, ctx });

    // Assert
    expect(getInstancesSubjects).toBeCalledWith({
      instances: objects.map((el) => el.instance),
      ctx,
    });
    expect(getGrade).toBeCalledWith({
      assignation: expect.stringMatching('assignation'),
      visibleToStudent: true,
      type: 'main',
      ctx,
    });
    expect(response).toEqual(['instanceId3']);
  });

  it('Should return instances if query.evaluated is true', async () => {
    // Arrange
    getGrade
      .mockReturnValueOnce([
        {
          assignation: 'assignationId1',
          subject: 'subjectId1',
          type: 'main',
          grade: 7,
          visibleToStudent: true,
          gradedBy: 'teacher-0',
        },
      ])
      .mockReturnValueOnce([
        {
          assignation: 'assignationId2',
          subject: 'subjectId2',
          type: 'main',
          grade: 9,
          visibleToStudent: true,
          gradedBy: 'teacher-1',
        },
      ])
      .mockReturnValueOnce([]);

    getInstancesSubjects.mockReturnValue({
      instanceId1: ['subjectId1'],
      instanceId2: ['subjectId2'],
      instanceId3: ['subjectId3'],
    });

    const query = { evaluated: true };

    // Act
    const response = await filterByGraded({ objects, query, isTeacher, ctx });

    // Assert
    expect(getInstancesSubjects).toBeCalledWith({
      instances: objects.map((el) => el.instance),
      ctx,
    });
    expect(getGrade).toBeCalledWith({
      assignation: expect.stringMatching('assignation'),
      visibleToStudent: true,
      type: 'main',
      ctx,
    });
    expect(response).toEqual(['instanceId1', 'instanceId2']);
  });
});

describe('filterByGraded when rule is Teacher', () => {
  // Arrange
  const isTeacher = true;
  const objects = assignations.map((el) => el.instance);

  it('Should return instances if query.evaluated is undefined', async () => {
    // Arrange
    const query = {};

    // Act
    const response = await filterByGraded({ objects, query, isTeacher, ctx });

    // Assert
    expect(response).toEqual(['instanceId1', 'instanceId2', 'instanceId3']);
  });

  it('Should return instances if query.evaluated is false', async () => {
    // Arrange
    getInstancesSubjects.mockReturnValue({
      instanceId1: ['subjectId1'],
      instanceId2: ['subjectId2'],
      instanceId3: ['subjectId3'],
    });

    // Arrange
    const studentsAssignations = await ctx.tx.db.Assignations.find({
      instance: objects,
    })
      .select(['instance', 'id'])
      .lean();

    studentsAssignations.forEach((el) => {
      if (['assignationId1', 'assignationId2'].includes(el.id)) {
        getGrade.mockReturnValueOnce([
          {
            assignation: el.id,
            subject: 'subjectId1',
            type: 'main',
            grade: 7,
            visibleToStudent: true,
            gradedBy: 'teacher-0',
          },
        ]);
      } else getGrade.mockReturnValueOnce([]);
    });

    const query = { evaluated: false };

    // Act
    const response = await filterByGraded({ objects, query, isTeacher, ctx });

    // Assert
    expect(getInstancesSubjects).toBeCalledWith({
      instances: objects,
      ctx,
    });
    expect(getGrade).toBeCalledWith({
      assignation: expect.stringMatching('assignation'),
      visibleToStudent: false,
      type: 'main',
      ctx,
    });
    expect(response).toEqual(['instanceId3']);
  });

  it('Should return instances if query.evaluated is true', async () => {
    // Arrange
    const studentsAssignations = await ctx.tx.db.Assignations.find({
      instance: objects,
    })
      .select(['instance', 'id'])
      .lean();

    studentsAssignations.forEach((el) => {
      if (['assignationId1', 'assignationId2'].includes(el.id)) {
        getGrade.mockReturnValueOnce([
          {
            assignation: el.id,
            subject: 'subjectId1',
            type: 'main',
            grade: 7,
            visibleToStudent: true,
            gradedBy: 'teacher-0',
          },
        ]);
      } else getGrade.mockReturnValueOnce([]);
    });

    getInstancesSubjects.mockReturnValue({
      instanceId1: ['subjectId1'],
      instanceId2: ['subjectId2'],
      instanceId3: ['subjectId3'],
    });

    const query = { evaluated: true };

    // Act
    const response = await filterByGraded({ objects, query, isTeacher, ctx });

    // Assert
    expect(getInstancesSubjects).toBeCalledWith({
      instances: objects,
      ctx,
    });
    expect(getGrade).toBeCalledWith({
      assignation: expect.stringMatching('assignation'),
      visibleToStudent: false,
      type: 'main',
      ctx,
    });
    expect(getGrade).toBeCalledWith({
      assignation: expect.stringMatching('assignation'),
      visibleToStudent: false,
      type: 'main',
      ctx,
    });
    expect(response).toEqual(['instanceId1', 'instanceId2']);
  });
});
