const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { searchByProgram } = require('./searchByProgram');
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

it('Should find all the assignables', async () => {
  // Arrange
  const programId = 'program-id';
  const assignables = ['assignable-id-1', 'assignable-id-2'];
  const initialValues = [
    {
      assignable: assignables[0],
      program: programId,
      subject: 'subject-id-1',
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: programId,
      subject: 'subject-id-2',
      level: 'intermediate',
    },
    {
      assignable: 'another-assignable-id',
      program: 'other-program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
  ];

  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  await ctx.db.Subjects.create(initialValues);

  // Act
  const response = await searchByProgram({ id: programId, ctx });

  // Assert
  expect(response.sort()).toEqual(assignables.sort());
});

it('Should find all the assignables having all the programs', async () => {
  // Arrange
  const programIds = ['program-id', 'program-id-2'];
  const assignables = ['assignable-id-1', 'assignable-id-2'];
  const initialValues = [
    {
      assignable: assignables[0],
      program: programIds[0],
      subject: 'subject-id-1',
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: programIds[0],
      subject: 'subject-id-2',
      level: 'intermediate',
    },
    {
      assignable: assignables[0],
      program: programIds[1],
      subject: 'subject-id-3',
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: programIds[1],
      subject: 'subject-id-4',
      level: 'intermediate',
    },
    {
      assignable: 'another-assignable-id',
      program: 'other-program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
  ];

  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  await ctx.db.Subjects.create(initialValues);

  // Act
  const response = await searchByProgram({ id: programIds, ctx });

  // Assert
  expect(response.sort()).toEqual(assignables.sort());
});

it('Should not the assignables not having all the programs', async () => {
  // Arrange
  const programIds = ['program-id', 'program-id-2'];
  const assignables = ['assignable-id-1', 'assignable-id-2'];
  const initialValues = [
    {
      assignable: assignables[0],
      program: programIds[0],
      subject: 'subject-id-1',
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: programIds[0],
      subject: 'subject-id-2',
      level: 'intermediate',
    },
    {
      assignable: assignables[0],
      program: programIds[1],
      subject: 'subject-id-3',
      level: 'intermediate',
    },
    {
      assignable: 'another-assignable-id',
      program: 'other-program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
  ];

  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  await ctx.db.Subjects.create(initialValues);

  // Act
  const response = await searchByProgram({ id: programIds, ctx });

  // Assert
  expect(response).toEqual([assignables[0]]);
});

it('Should include all the assignables having more than the provided programs', async () => {
  // Arrange
  const programIds = ['program-id', 'program-id-2'];
  const assignables = ['assignable-id-1', 'assignable-id-2'];
  const initialValues = [
    {
      assignable: assignables[0],
      program: programIds[0],
      subject: 'subject-id-1',
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: programIds[0],
      subject: 'subject-id-2',
      level: 'intermediate',
    },
    {
      assignable: assignables[0],
      program: programIds[1],
      subject: 'subject-id-3',
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: programIds[1],
      subject: 'subject-id-4',
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: 'another-program-to-include',
      subject: 'subject-id-4',
      level: 'intermediate',
    },
    {
      assignable: 'another-assignable-id',
      program: 'other-program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
  ];

  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  await ctx.db.Subjects.create(initialValues);

  // Act
  const response = await searchByProgram({ id: programIds, ctx });

  // Assert
  expect(response.sort()).toEqual(assignables.sort());
});

it('Should throw if no required params are provided', () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  // Act
  const testFn = () => searchByProgram({ id: undefined, ctx });

  // Assert
  return expect(testFn).rejects.toThrowError('Cannot search by program: id is required');
});
