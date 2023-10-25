const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getGrade } = require('./getGrade');
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

it("Should return all the assignation's grade", async () => {
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
      type: 'effort',
      grade: 9,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject: 'subject-id-2',
      type: 'main',
      grade: 7.5,
      visibleToStudent: true,
      gradedBy: 'teacher-1',
    },
  ];
  await ctx.db.Grades.create(initialValues);
  const expectedValues = await ctx.db.Grades.find({}).lean();

  // Act
  const response = await getGrade({ assignation, ctx });

  // Assert
  expect(response).toEqual(expectedValues);
});

it("Should return the assignation's grade for the given subject", async () => {
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
      type: 'effort',
      grade: 9,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject: 'subject-id-2',
      type: 'main',
      grade: 7.5,
      visibleToStudent: true,
      gradedBy: 'teacher-1',
    },
  ];
  await ctx.db.Grades.create(initialValues);
  const expectedValues = await ctx.db.Grades.find({ subject }).lean();

  // Act
  const response = await getGrade({ assignation, subject, ctx });

  // Assert
  expect(response).toEqual(expectedValues);
});

it("Should return the assignation's grade for the given subject and type", async () => {
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
      type: 'effort',
      grade: 9,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject: 'subject-id-2',
      type,
      grade: 7.5,
      visibleToStudent: true,
      gradedBy: 'teacher-1',
    },
  ];
  await ctx.db.Grades.create(initialValues);
  const expectedValues = await ctx.db.Grades.find({ subject, type }).lean();

  // Act
  const response = await getGrade({ assignation, subject, type, ctx });

  // Assert
  expect(response).toEqual(expectedValues);
});

it("Should return the assignation's grade for the given subject, type and visibility", async () => {
  // Arrange
  const assignation = 'assignation-id';
  const subject = 'subject-id-1';
  const type = 'main';
  const visibleToStudent = true;

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
      visibleToStudent,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject,
      type: 'effort',
      grade: 9,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject: 'subject-id-2',
      type,
      grade: 7.5,
      visibleToStudent: true,
      gradedBy: 'teacher-1',
    },
  ];
  await ctx.db.Grades.create(initialValues);
  const expectedValues = await ctx.db.Grades.find({ subject, type }).lean();

  // Act
  const EqualVisibilityResponse = await getGrade({
    assignation,
    subject,
    type,
    visibleToStudent,
    ctx,
  });
  const DifferentVisibilityResponse = await getGrade({
    assignation,
    subject,
    type,
    visibleToStudent: !visibleToStudent,
    ctx,
  });

  // Assert
  expect(EqualVisibilityResponse).toEqual(expectedValues);
  expect(DifferentVisibilityResponse).toEqual([]);
});

it("Should return the assignation's grade for the given type", async () => {
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
      type: 'effort',
      grade: 9,
      visibleToStudent: true,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject: 'subject-id-2',
      type,
      grade: 7.5,
      visibleToStudent: true,
      gradedBy: 'teacher-1',
    },
  ];
  await ctx.db.Grades.create(initialValues);
  const expectedValues = await ctx.db.Grades.find({ type }).lean();

  // Act
  const response = await getGrade({ assignation, type, ctx });

  // Assert
  expect(response).toEqual(expectedValues);
});

it("Should return the assignation's grade for the given visibility", async () => {
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
      type: 'effort',
      grade: 9,
      visibleToStudent: false,
      gradedBy: 'teacher-0',
    },
    {
      assignation,
      subject: 'subject-id-2',
      type: 'main',
      grade: 7.5,
      visibleToStudent: true,
      gradedBy: 'teacher-1',
    },
  ];
  await ctx.db.Grades.create(initialValues);
  const expectedValues = await ctx.db.Grades.find({}).lean();

  // Act
  const visibilityResponse = await getGrade({
    assignation,
    visibleToStudent: true,
    ctx,
  });
  const noVisibilityResponse = await getGrade({
    assignation,
    visibleToStudent: false,
    ctx,
  });

  // Assert
  expect(visibilityResponse).toEqual(
    expectedValues.filter(({ visibleToStudent: visibility }) => !!visibility)
  );
  expect(noVisibilityResponse).toEqual(
    expectedValues.filter(({ visibleToStudent: visibility }) => !visibility)
  );
});

it('Should throw when no assignation id is provided', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  // Act
  const testFn = () => getGrade({ assignation: undefined, ctx });

  // Assert
  expect(testFn).rejects.toThrowError(
    'Cannot getGrade: assignation is required'
  );
});
