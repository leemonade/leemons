const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { unregisterGrade } = require('./unregisterGrade');
const { gradesSchema } = require('../../models/grades');

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

it('Should unregister all the grades for an assignation', async () => {
  // Arrange
  const assignation = 'assignation-id';

  const ctx = generateCtx({
    models: {
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  const initialValues = [
    {
      assignation,
      subject: 'subject-id-1',
      type: 'main',
      grade: 7,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject: 'subject-id-1',
      type: 'secondary',
      grade: 8,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject: 'subject-id-2',
      type: 'main',
      grade: 9,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
  ];
  await ctx.db.Grades.create(initialValues);

  // Act
  const response = await unregisterGrade({ assignation, ctx });
  const savedCount = await ctx.db.Grades.countDocuments({});

  // Assert
  expect(response).toBe(initialValues.length);
  expect(savedCount).toBe(0);
});

it('Should unregister all the grades for an assignation and subject', async () => {
  // Arrange
  const assignation = 'assignation-id';
  const subject = 'subject-id-1';

  const ctx = generateCtx({
    models: {
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  const initialValues = [
    {
      assignation,
      subject,
      type: 'main',
      grade: 7,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject,
      type: 'secondary',
      grade: 8,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject: 'subject-id-2',
      type: 'main',
      grade: 9,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
  ];
  await ctx.db.Grades.create(initialValues);

  // Act
  const response = await unregisterGrade({ assignation, subject, ctx });
  const remainingCount = await ctx.db.Grades.countDocuments({ subject });

  // Assert
  expect(response).toBe(2);
  expect(remainingCount).toBe(0);
});

it('Should unregister all the grades for an assignation and type', async () => {
  // Arrange
  const assignation = 'assignation-id';
  const type = 'main';

  const ctx = generateCtx({
    models: {
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  const initialValues = [
    {
      assignation,
      subject: 'subject-id-1',
      type,
      grade: 7,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject: 'subject-id-1',
      type: 'secondary',
      grade: 8,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject: 'subject-id-2',
      type,
      grade: 9,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
  ];
  await ctx.db.Grades.create(initialValues);

  // Act
  const response = await unregisterGrade({ assignation, type, ctx });
  const remainingCount = await ctx.db.Grades.countDocuments({ type });

  // Assert
  expect(response).toBe(2);
  expect(remainingCount).toBe(0);
});

it('Should unregister all the grades for an assignation, subject and type', async () => {
  // Arrange
  const assignation = 'assignation-id';
  const subject = 'subject-id-1';
  const type = 'main';

  const ctx = generateCtx({
    models: {
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  const initialValues = [
    {
      assignation,
      subject,
      type,
      grade: 7,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject,
      type: 'secondary',
      grade: 8,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject: 'subject-id-2',
      type,
      grade: 9,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
  ];
  await ctx.db.Grades.create(initialValues);

  // Act
  const response = await unregisterGrade({ assignation, subject, type, ctx });
  const remainingCount = await ctx.db.Grades.countDocuments({
    type,
    subject,
  }).lean();

  // Assert
  expect(response).toBe(1);
  expect(remainingCount).toBe(0);
});

it('Should throw an error if no assignation is provided', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  // Act
  const testFn = () => unregisterGrade({ assignation: undefined, ctx });

  // Act and Assert
  await expect(testFn).rejects.toThrowError(
    'Cannot unregister grade: assignation is required'
  );
});
