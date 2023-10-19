const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { searchBySubject } = require('./searchBySubject');
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
  const subjectId = 'subject-id';
  const assignables = ['assignable-id-1', 'assignable-id-2'];
  const initialValues = [
    {
      assignable: assignables[0],
      program: 'program-id',
      subject: subjectId,
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: 'program-id',
      subject: subjectId,
      level: 'intermediate',
    },
    {
      assignable: 'another-assignable-id',
      program: 'program-id',
      subject: 'other-subject-id',
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
  const response = await searchBySubject({ id: subjectId, ctx });

  // Assert
  expect(response).toEqual(expect.arrayContaining(assignables));
});

it('Should find all the assignables having all the subjects', async () => {
  // Arrange
  const subjectIds = ['subject-id', 'subject-id-2'];
  const assignables = ['assignable-id-1', 'assignable-id-2'];
  const initialValues = [
    {
      assignable: assignables[0],
      program: 'program-id',
      subject: subjectIds[0],
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: 'program-id',
      subject: subjectIds[0],
      level: 'intermediate',
    },
    {
      assignable: assignables[0],
      program: 'program-id',
      subject: subjectIds[1],
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: 'program-id',
      subject: subjectIds[1],
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
  const response = await searchBySubject({ id: subjectIds, ctx });

  // Assert
  expect(response.sort((a, b) => a.localeCompare(b))).toEqual(
    assignables.sort((a, b) => a.localeCompare(b))
  );
});

it('Should not the assignables not having all the subjects', async () => {
  // Arrange
  const subjectIds = ['subject-id', 'subject-id-2'];
  const assignables = ['assignable-id-1', 'assignable-id-2'];
  const initialValues = [
    {
      assignable: assignables[0],
      program: 'program-id',
      subject: subjectIds[0],
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: 'program-id',
      subject: subjectIds[0],
      level: 'intermediate',
    },
    {
      assignable: assignables[0],
      program: 'program-id',
      subject: subjectIds[1],
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
  const response = await searchBySubject({ id: subjectIds, ctx });

  // Assert
  expect(response).toEqual([assignables[0]]);
});

it('Should include all the assignables having more than the provided subjects', async () => {
  // Arrange
  const subjectIds = ['subject-id', 'subject-id-2'];
  const assignables = ['assignable-id-1', 'assignable-id-2'];
  const initialValues = [
    {
      assignable: assignables[0],
      program: 'program-id',
      subject: subjectIds[0],
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: 'program-id',
      subject: subjectIds[0],
      level: 'intermediate',
    },
    {
      assignable: assignables[0],
      program: 'program-id',
      subject: subjectIds[1],
      level: 'intermediate',
    },
    {
      assignable: assignables[1],
      program: 'program-id',
      subject: subjectIds[1],
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
  const response = await searchBySubject({ id: subjectIds, ctx });

  // Assert
  expect(response).toEqual(expect.arrayContaining(assignables));
});

it('Should throw if no required params are provided', () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  // Act
  const testFn = () => searchBySubject({ id: undefined, ctx });

  // Assert
  return expect(testFn).rejects.toThrow('Cannot search by subject: id is required');
});
