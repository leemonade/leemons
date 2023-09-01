const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { saveSubjects } = require('./saveSubjects');
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

it('Should save the subjects to the assignable', async () => {
  // Arrange
  const assignable = 'assignable-id';
  const subjects = [
    {
      subject: 'subject-id-1',
      program: 'program-id',
      level: 'intermediate',
    },
    {
      subject: 'subject-id-2',
      program: 'program',
      level: 'intermediate',
      curriculum: {
        anyProp: true,
      },
    },
  ];

  const expectedValue = subjects.map((subject) =>
    expect.objectContaining({ ...subject, assignable })
  );

  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  // Act
  const response = await saveSubjects({ assignableId: assignable, subjects, ctx });

  const dbValues = await ctx.tx.db.Subjects.find({}).lean();

  // Assert
  expect(response).toEqual(expectedValue);
  expect(dbValues.sort()).toEqual(expectedValue.sort());
});

it('Should throw if no valid subject is provided', () => {
  // Arrange
  const assignable = 'assignable01';
  const subjects = [
    {
      // subject: 'subject0',
      program: 'program',
    },
    {
      subject: 'subject1',
      // program: 'program',
    },
  ];

  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  // Act
  const noSubjectTestFn = () =>
    saveSubjects({ assignableId: assignable, subjects: [subjects[0]], ctx });
  const noProgramTestFn = () =>
    saveSubjects({ assignableId: assignable, subjects: [subjects[1]], ctx });

  // Assert
  return Promise.all([
    expect(noSubjectTestFn).rejects.toThrowError(
      /^Failed to save assignables' subjects: .*`subject`/
    ),
    expect(noProgramTestFn).rejects.toThrowError(
      /^Failed to save assignables' subjects: .*`program`/
    ),
  ]);
});
