const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { updateSubjects } = require('./updateSubjects');
const { subjectsSchema } = require('../../models/subjects');

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

it('Should add the new subjects', async () => {
  // Arrange
  const assignable = 'assignable-id';
  const subjects = [
    {
      program: 'program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
    {
      program: 'program-id',
      subject: 'subject-id-2',
      level: 'medium',
      curriculum: { any: 'prop' },
    },
  ];

  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  // Act
  const response = await updateSubjects({ assignable, subjects, ctx });
  const subjectsSaved = await ctx.db.Subjects.find({}).lean();

  // Assert
  expect(response.sort()).toEqual(subjects.sort());
  expect(subjectsSaved.sort()).toEqual(
    subjects.map((subject) => expect.objectContaining({ ...subject, assignable }))
  );
});

it('Should remove the old subjects', async () => {
  // Arrange
  const assignable = 'assignable-id';

  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  const initialValues = [
    {
      assignable,
      program: 'program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
    {
      assignable,
      program: 'program-id',
      subject: 'subject-id-2',
      level: 'medium',
      curriculum: { any: 'prop' },
    },
  ];
  await ctx.db.Subjects.insertMany(initialValues);

  // Act
  const response = await updateSubjects({ assignable, subjects: [], ctx });
  const subjectsSavedCount = await ctx.db.Subjects.countDocuments({});

  // Assert
  expect(response).toEqual([]);
  expect(subjectsSavedCount).toBe(0);
});

it('Should both remove the old subjects and add the new ones', async () => {
  // Arrange
  const assignable = 'assignable-id';

  const subjects = [
    {
      program: 'program-id',
      subject: 'subject-id-2',
      level: 'intermediate',
    },
    {
      program: 'program-id',
      subject: 'subject-id-3',
      level: 'medium',
      curriculum: { any: 'prop' },
    },
  ];

  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  const initialValues = [
    {
      assignable,
      program: 'program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
    {
      assignable,
      program: 'program-id',
      subject: 'subject-id-2',
      level: 'medium',
      curriculum: { any: 'prop' },
    },
  ];
  await ctx.db.Subjects.insertMany(initialValues);

  // Act
  const response = await updateSubjects({ assignable, subjects, ctx });
  const subjectsSavedCount = await ctx.db.Subjects.countDocuments({});

  // Assert
  expect(response.sort()).toEqual(subjects.sort());
  expect(subjectsSavedCount).toBe(2);
});

it('Should throw if no valid params are provided', async () => {
  // Arrange
  const assignable = 'assignable-id';
  const subjects = [
    {
      program: 'program-id',
      subject: 'subject-id',
      level: 'intermediate',
    },
  ];

  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  // Act
  const noAssignableFn = () => updateSubjects({ assignable: undefined, subjects, ctx });
  const noSubjectsFn = () => updateSubjects({ assignable, subjects: undefined, ctx });

  // Assert
  expect(noAssignableFn).rejects.toThrowError(
    'Cannot update subjects: assignable and subjects are required'
  );
  expect(noSubjectsFn).rejects.toThrowError(
    'Cannot update subjects: assignable and subjects are required'
  );
});
