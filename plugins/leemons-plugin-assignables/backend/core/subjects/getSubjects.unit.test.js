const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { initial } = require('lodash');
const { getSubjects } = require('./getSubjects');
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

it("Should return the assignables' subjects", async () => {
  // Arrange
  const assignable = 'assignable-id';
  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  const expectedValues = [
    {
      program: 'program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
    {
      program: 'program-id',
      subject: 'subject-id-2',
      level: 'intermediate',
    },
  ];

  const initialValues = [
    ...expectedValues.map((value) => ({ ...value, assignable })),
    {
      assignable: 'another-assignable-id',
      program: 'program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
  ];
  await ctx.db.Subjects.insertMany(initialValues);

  // Act
  const response = await getSubjects({ assignableIds: assignable, ctx });

  // Assert
  expect(response).toEqual(expect.arrayContaining(expectedValues));
});

it("Should return both assignables' subjects", async () => {
  // Arrange
  const assignables = ['assignable-id-1', 'assignable-id-2'];
  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  const initialValues = [
    {
      assignable: assignables[0],
      program: 'program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
    {
      assignable: assignables[0],
      program: 'program-id',
      subject: 'subject-id-2',
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: 'program-id',
      subject: 'subject-id-3',
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: 'program-id',
      subject: 'subject-id-4',
      level: 'intermediate',
    },
    {
      assignable: 'another-assignable-id',
      program: 'program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
  ];
  await ctx.db.Subjects.insertMany(initialValues);

  const expectedValues = initial(initialValues).reduce(
    (obj, { assignable, ...program }) => ({
      ...obj,
      [assignable]: [...(obj[assignable] ?? []), program],
    }),
    {}
  );

  // Act
  const response = await getSubjects({ assignableIds: assignables, ctx });

  // Assert
  expect(response).toEqual(expectedValues);
});

it("Should return the assignables' subjects with id", async () => {
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
      level: 'intermediate',
    },
    {
      assignable: 'another-assignable-id',
      program: 'program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
  ];
  await ctx.db.Subjects.insertMany(initialValues);
  const expectedValues = await ctx.db.Subjects.find({ assignable })
    .select({ program: true, subject: true, level: true, id: true, _id: false })
    .lean();

  // Act
  const response = await getSubjects({
    assignableIds: assignable,
    useIds: true,
    ctx,
  });

  // Assert
  expect(response.sort()).toEqual(expectedValues.sort());
});

it("Should return both assignables' subjects with id", async () => {
  // Arrange
  const assignables = ['assignable-id-1', 'assignable-id-2'];
  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  const initialValues = [
    {
      assignable: assignables[0],
      program: 'program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
    {
      assignable: assignables[0],
      program: 'program-id',
      subject: 'subject-id-2',
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: 'program-id',
      subject: 'subject-id-3',
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: 'program-id',
      subject: 'subject-id-4',
      level: 'intermediate',
    },
    {
      assignable: 'another-assignable-id',
      program: 'program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
  ];
  await ctx.db.Subjects.insertMany(initialValues);

  const savedSubjects = await ctx.db.Subjects.find({
    assignable: assignables,
  })
    .select({
      assignable: true,
      program: true,
      subject: true,
      level: true,
      id: true,
      _id: false,
    })
    .lean();
  const expectedValues = savedSubjects.reduce(
    (obj, { assignable, ...program }) => ({
      ...obj,
      [assignable]: [...(obj[assignable] ?? []), program],
    }),
    {}
  );

  // Act
  const response = await getSubjects({
    assignableIds: assignables,
    useIds: true,
    ctx,
  });

  // Assert
  expect(response).toEqual(expectedValues);
});

it('Should return an empty array when no subjects are found', async () => {
  // Arrange
  const assignable = 'assignable-id';
  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  const expectedValue = [];

  // Act
  const response = await getSubjects({ assignableIds: assignable, ctx });

  // Assert
  expect(response).toEqual(expectedValue);
});

it('Should throw when no ids are provided', () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  // Act
  const testFn = () => getSubjects({ assignableIds: undefined, ctx });

  // Assert
  return expect(testFn).rejects.toThrowError('Cannot get subjects: assignableIds is required');
});
